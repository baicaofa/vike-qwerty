import tailwindcss from 'prettier-plugin-tailwindcss'

export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  endOfLine: 'auto',
  plugins: ['@trivago/prettier-plugin-sort-imports', tailwindcss],
}
