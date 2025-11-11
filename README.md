# UnrealIRCd Module Builder

A drag-and-drop no-code builder for creating third-party modules for UnrealIRCd using TypeScript and Node.js.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Features

- Visual drag-and-drop interface using React Flow
- Generate C code for UnrealIRCd modules
- Support for commands, hooks, capabilities, and module metadata
- Local storage persistence
- Comprehensive node types including logging, RPC endpoints, ISUPPORT tokens, and user modes

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage

1. Add nodes by clicking the buttons: Module Info, Command, Hook, Capability.
2. Edit the properties in each node.
3. Connect nodes if needed (for future logic flow).
4. Click "Generate Module" to download the C code.

## Project Structure

- `components/ModuleBuilder.tsx`: Main React component with React Flow
- `app/api/generate/route.ts`: API endpoint to generate C code
- Based on examples from `/home/valerie/ubeValware/src/modules/third/`

## Contributing

Feel free to add more node types, improve the UI, or enhance the code generation.

## Repository

https://github.com/ValwareIRC/modbuilder
```
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
