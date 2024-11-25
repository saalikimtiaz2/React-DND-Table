/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    importOrder: ['^src/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    plugins: [
        'prettier-plugin-tailwindcss',
        '@trivago/prettier-plugin-sort-imports',
    ],
}

export default config
