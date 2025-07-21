export function LogErrors(context?: string): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const that: any = this;

            // Sanitize args before logging
            const sanitizedArgs = args.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    const clone: any = {};
                    Object.getOwnPropertyNames(arg).forEach(key => {
                        clone[key] = key.toLowerCase().includes('password') ? '[REDACTED]' : arg[key];
                    });
                    return clone;
                }

                // Se for string, evitar e-mails e sanitizar apenas se parece claramente com senha
                if (typeof arg === 'string') {
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(arg);
                    const looksLikePassword = /[A-Z]/.test(arg) && /[a-z]/.test(arg) && /\d/.test(arg) && arg.length >= 8;

                    if (!isEmail && looksLikePassword) {
                        return '[REDACTED]';
                    }
                }

                return arg;
            });

            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                if (that?.logDbService?.logError) {
                    await that.logDbService.logError(
                        error,
                        propertyKey.toString(),
                        sanitizedArgs,
                        context || target.constructor.name,
                    );
                } else {
                    console.error(`[LogErrors] logDbService not found on class: ${target.constructor.name}`, {
                        error,
                        method: propertyKey.toString(),
                        args: sanitizedArgs,
                    });
                }
                throw error;
            }
        };

        return descriptor;
    };
}
