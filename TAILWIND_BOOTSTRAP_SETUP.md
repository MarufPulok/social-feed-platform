# Tailwind CSS + Bootstrap Setup Guide

This project is configured to use both **Tailwind CSS** and **Bootstrap** together. This guide explains how they work together and how to use them effectively.

## Configuration Overview

### CSS Import Order
The CSS files are imported in the following order in `src/app/globals.css`:

1. **Bootstrap CSS** (`bootstrap.min.css`)
2. **Custom CSS** (`common.css`, `main.css`, `responsive.css`)
3. **Tailwind CSS** (via `@import "tailwindcss"`)

This order ensures:
- Bootstrap's base styles are applied first
- Custom CSS can override Bootstrap when needed
- Tailwind utilities can override both when using `!important` (configured)

### Tailwind Configuration

The `tailwind.config.ts` file is configured with:

- **`preflight: false`** - Disables Tailwind's reset styles to avoid conflicts with Bootstrap's normalize
- **`important: true`** - Adds `!important` to all Tailwind utilities, giving them higher specificity than Bootstrap classes
- **Content paths** - Configured to scan all React/TypeScript files in `src/`

## Usage Strategies

### Strategy 1: Use Tailwind with Important Flag (Current Setup)

With `important: true` in the config, Tailwind utilities will override Bootstrap classes:

```tsx
// Bootstrap class
<div className="container">
  {/* Tailwind utility will override Bootstrap's padding */}
  <div className="p-8">Content</div>
</div>
```

**Pros:**
- Simple - no prefix needed
- Tailwind utilities always win in conflicts
- Easy to use

**Cons:**
- All Tailwind utilities have `!important`
- Can make debugging harder
- Less flexible

### Strategy 2: Use Prefix (Alternative)

If you prefer more control, you can switch to a prefix approach:

1. Update `tailwind.config.ts`:
```typescript
prefix: "tw-",
important: false, // or remove this line
```

2. Use Tailwind classes with prefix:
```tsx
<div className="container">
  <div className="tw-p-8 tw-flex tw-items-center">
    Content
  </div>
</div>
```

**Pros:**
- Clear separation between Bootstrap and Tailwind
- No `!important` pollution
- More predictable behavior

**Cons:**
- Need to remember the prefix
- Slightly more verbose

## Best Practices

### 1. Use Bootstrap for Layout Components
Bootstrap's grid system and components work well for complex layouts:

```tsx
<div className="container">
  <div className="row">
    <div className="col-md-6">
      {/* Use Bootstrap grid */}
    </div>
  </div>
</div>
```

### 2. Use Tailwind for Utilities
Tailwind excels at utility classes for spacing, colors, and responsive design:

```tsx
<div className="container">
  {/* Tailwind utilities for fine-grained control */}
  <div className="p-4 md:p-8 lg:p-12 bg-blue-500 rounded-lg">
    Content
  </div>
</div>
```

### 3. Mix Both When Needed
You can combine both frameworks:

```tsx
{/* Bootstrap for structure, Tailwind for styling */}
<div className="card">
  <div className="card-body p-6 bg-gradient-to-r from-blue-500 to-purple-500">
    <h5 className="card-title text-white font-bold text-xl">
      Title
    </h5>
  </div>
</div>
```

### 4. Custom CSS Classes
Your existing custom classes (prefixed with `_`) will work alongside both:

```tsx
<div className="_layout _dis_flex tw-gap-4">
  {/* Custom class + Tailwind utility */}
</div>
```

## Conflict Resolution

### When Bootstrap and Tailwind Conflict

With `important: true`, Tailwind utilities will win. If you need Bootstrap to win:

1. Use more specific selectors
2. Use inline styles
3. Add custom CSS with higher specificity
4. Switch to prefix strategy for more control

### Example Conflict Resolution

```tsx
{/* Bootstrap's .btn has padding, but Tailwind's p-4 will override */}
<button className="btn p-4">
  Click me
</button>

{/* To keep Bootstrap's padding, don't use Tailwind padding utilities */}
<button className="btn">
  Click me
</button>

{/* Or use custom CSS class */}
<button className="btn _padd_t20">
  Click me
</button>
```

## File Structure

```
src/
├── app/
│   ├── globals.css          # Imports Bootstrap, custom CSS, and Tailwind
│   └── layout.tsx           # Includes Bootstrap JS scripts
├── components/             # Use Tailwind/Bootstrap here
└── ...

public/
└── assets/
    ├── css/
    │   ├── bootstrap.min.css
    │   ├── common.css
    │   ├── main.css
    │   └── responsive.css
    └── js/
        ├── bootstrap.bundle.min.js
        └── custom.js
```

## Testing the Setup

1. **Verify Bootstrap is working:**
```tsx
<div className="container">
  <div className="row">
    <div className="col-12">
      <button className="btn btn-primary">Bootstrap Button</button>
    </div>
  </div>
</div>
```

2. **Verify Tailwind is working:**
```tsx
<div className="p-4 bg-blue-500 text-white rounded-lg">
  Tailwind utilities work!
</div>
```

3. **Test conflict resolution:**
```tsx
{/* Tailwind should override Bootstrap padding */}
<div className="p-5 bg-primary p-8">
  Should have p-8 (Tailwind), not p-5 (Bootstrap)
</div>
```

## Troubleshooting

### Tailwind classes not working?
- Check that `globals.css` is imported in `layout.tsx`
- Verify `tailwind.config.ts` content paths include your files
- Restart the dev server after config changes

### Bootstrap classes not working?
- Verify Bootstrap CSS is imported in `globals.css`
- Check that Bootstrap JS is loaded (check browser console)
- Ensure Bootstrap JS script is in `layout.tsx`

### Styles conflicting unexpectedly?
- Check the CSS import order in `globals.css`
- Review `important: true` setting in `tailwind.config.ts`
- Consider switching to prefix strategy for more control

## Migration Tips

When migrating from Bootstrap to Tailwind:

1. **Start with utilities** - Replace Bootstrap utility classes with Tailwind equivalents
2. **Keep Bootstrap components** - Keep using Bootstrap for complex components (modals, dropdowns, etc.)
3. **Gradual migration** - Migrate page by page, component by component
4. **Use both** - There's no need to remove Bootstrap immediately

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Using Tailwind with Bootstrap](https://tailwindcss.com/docs/preflight#disabling-preflight)

