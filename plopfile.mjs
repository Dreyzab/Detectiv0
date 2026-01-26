export default function (plop) {
    plop.setGenerator('fsd-slice', {
        description: 'Create a new FSD slice (Feature, Widget, Entity, Page)',
        prompts: [
            {
                type: 'list',
                name: 'layer',
                message: 'Select layer:',
                choices: ['features', 'widgets', 'entities', 'pages'],
            },
            {
                type: 'input',
                name: 'name',
                message: 'Slice name (kebab-case):',
            },
            {
                type: 'checkbox',
                name: 'parts',
                message: 'Select parts to generate:',
                choices: [
                    { name: 'ui', checked: true },
                    { name: 'model', checked: false },
                    { name: 'api', checked: false },
                    { name: 'lib', checked: false },
                ],
            },
        ],
        actions: (data) => {
            const actions = [];
            const basePath = 'apps/web/src/{{layer}}/{{kebabCase name}}';

            // Public API
            actions.push({
                type: 'add',
                path: `${basePath}/index.ts`,
                templateFile: '.plop-templates/index.hbs',
            });

            // UI
            if (data.parts.includes('ui')) {
                actions.push({
                    type: 'add',
                    path: `${basePath}/ui/{{pascalCase name}}.tsx`,
                    templateFile: '.plop-templates/component.hbs',
                });
            }

            // Model
            if (data.parts.includes('model')) {
                actions.push({
                    type: 'add',
                    path: `${basePath}/model/store.ts`,
                    templateFile: '.plop-templates/model.hbs',
                });
            }

            // API (Placeholder)
            if (data.parts.includes('api')) {
                actions.push({
                    type: 'add',
                    path: `${basePath}/api/index.ts`,
                    template: '// API logic for {{name}}\n',
                });
            }

            // Lib (Placeholder)
            if (data.parts.includes('lib')) {
                actions.push({
                    type: 'add',
                    path: `${basePath}/lib/index.ts`,
                    template: '// Library functions for {{name}}\n',
                });
            }

            return actions;
        },
    });

    plop.setGenerator('shared-ui', {
        description: 'Create a new shared UI component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name (pascal-case):',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'apps/web/src/shared/ui/{{pascalCase name}}/{{pascalCase name}}.tsx',
                templateFile: '.plop-templates/component.hbs',
            },
            {
                type: 'add',
                path: 'apps/web/src/shared/ui/{{pascalCase name}}/index.ts',
                template: "export * from './{{pascalCase name}}';\n",
            },
        ],
    });
}
