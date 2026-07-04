// Builds the OpenAPI spec from JSDoc @swagger comments living in src/routes/*.js.
// Reusable schemas are declared once here (components.schemas) instead of
// repeated inline in every route annotation, so BrandKit/User/Design shapes
// stay in exactly one place as the API grows.
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'BrandForge API',
        version: '1.0.0',
        description:
            'AI-powered Brand Kit and Social Post Generator — REST API reference. ' +
            'Authenticated routes use an httpOnly session cookie set by /auth/login or /auth/register.'
    },
    servers: [
        { url: `http://localhost:${config.port}/api`, description: 'Local development' }
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'token'
            }
        },
        schemas: {
            User: {
                type: 'object',
                description: 'Public-facing shape of a user (password hash is never returned by any endpoint).',
                properties: {
                    _id: { type: 'string', example: '665f19a1b2c3d4e5f6a7b8c9' },
                    username: { type: 'string', example: 'alice' }
                }
            },
            BrandKit: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
                    user: { type: 'string', example: '665f19a1b2c3d4e5f6a7b8c9' },
                    brandName: { type: 'string', example: 'Acme Corp' },
                    colors: {
                        type: 'object',
                        properties: {
                            primary: { type: 'string', example: '#1A2B3C' },
                            secondary: { type: 'string', example: '#FF6B00' },
                            accent: { type: 'string', example: '#00C2A8' }
                        }
                    },
                    fonts: {
                        type: 'object',
                        properties: {
                            heading: { type: 'string', example: 'Poppins' },
                            body: { type: 'string', example: 'Inter' }
                        }
                    },
                    toneOfVoice: { type: 'string', example: 'Bold, energetic, and confident' },
                    logoUrl: { type: 'string', nullable: true, example: 'https://ik.imagekit.io/.../logo.png' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            Design: {
                type: 'object',
                description:
                    'Reserved for Stage 2 — this model exists in the codebase but is not yet exposed ' +
                    'through any endpoint. Documented in advance so the schema is stable once /api/generate ships.',
                properties: {
                    _id: { type: 'string' },
                    user: { type: 'string' },
                    brandKit: { type: 'string' },
                    prompt: { type: 'string', example: 'Diwali Sale, 30% OFF' },
                    generatedContent: {
                        type: 'object',
                        description: 'Validated JSON returned by Gemini (headline, subheadline, cta, layout, colorAssignments).'
                    },
                    renderedHtml: { type: 'string' },
                    template: { type: 'string', enum: ['modern', 'minimal', 'bold'] },
                    renderDurationMs: { type: 'number', example: 420 },
                    generationDurationMs: { type: 'number', example: 1150 },
                    imageUrl: { type: 'string' },
                    platform: { type: 'string', example: 'instagram-post' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            ApiResponse: {
                type: 'object',
                properties: {
                    statusCode: { type: 'integer', example: 200 },
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { type: 'object', nullable: true }
                }
            },
            ApiErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: { type: 'string' },
                                message: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    },
    security: [{ cookieAuth: [] }]
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
