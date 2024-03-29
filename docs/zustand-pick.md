# Zustand pick transformer

## Motivation

When we wanted to pick some properties from a zustand store, this is what we
need to do:

```js
import { shallow } from "zustand/shallow";

const { order, customer } = useGlobalStore(
  store => ({
    order: store[sessionId]?.globals.order,
    customer: store[sessionId]?.globals.customer,
  }),
  shallow
);
```

This involves a lot of boilerplate code just to access two properties from a
store containing nested values.

This transformer is capable of generating all these boilerplate at the time of
transpiling (during bundling) so that we can focus on our business logic. If
this plugin is added to your babel configuration, you can write the following
code to get a similar effect as the above code:

```js
const { order, customer } = useGlobalStore.pick([sessionId, "globals"]);
```

You might also notice that we don't have the
`import { shallow } from "zustand/shallow"` statement in this piece of code. We
don't need that. The plugin will automatically add it for us at the time of
transpiling.

The plugin detects that `order` and `customer` properties are to be fetched from
the `store[sessionId].globals` property from `useGlobalStore` and it generates
code for it. Note that the plugin will automatically add
`import { shallow } from "zustand/shallow"` for us. We don't need to add it
ourselves.

## Allowed syntaxes

To explain the allowed syntaxes take this zustand store as the example:

```js
const useGlobalStore = create((set, get) => ({
  order: {
    id: "#1230",
    user: {
      email: "oliver@example.com",
      address: {
        "location 1": { street: "293, 1st Floor", city: "Mumbai" }
        "location 2": { street: "295, 3st Floor", city: "Chennai" }
      },
    },
    items: {
      // itemID: { ...properties }
      "47e91f1a-0c4d-4a79-a939-1319d8659bd2": { quantity: 10, price: 100 },
      "64b7e54c-5d8a-443a-b70b-fff3d6937eba": { quantity: 3, price: 34 },
    },
  },

  setOrder: order => set({ order }),
}));
```

These are the allowed syntaxes:

```js
// picks `order` data and `setOrder` action from the store
const { order, setOrder } = useGlobalStore.pick();

// picks `id` and `user` from inside store.order
const { id, user } = useGlobalStore.pick("order");

// supports default values
const { user = {} } = useGlobalStore.pick();

// picks `quantity` of dynamically obtained item of id `itemId`
const { quantity } = useGlobalStore.pick(["order", "items", itemId]);

// picks all stored properties of dynamically obtained item of id `itemId`
const { [itemId]: itemDetails } = useGlobalStore.pick(["order", "items"]);

// picks all stored properties of the location at `index` from store.order.user.address
const { [`location ${index}`]: address } = useGlobalStore.pick([
  "order",
  "user",
  "address",
]);
```

## Disallowed syntaxes

We have introduced a type definition for `pick` method from zustand stores from
neeto-commons-frontend to make IDE capable of pointing out errors as you type.
But it is not 100% foolproof. So here is a list of usages that are flagged as
syntax errors during transpilation.

1. Nesting is not allowed in the variable declaration.

   **incorrect**

   ```js
   const {
     order: { user },
   } = useGlobalStore.pick();
   ```

   **correct**

   ```js
   const { order } = useGlobalStore.pick();
   const { user } = useGlobalStore.pick("order"); // to get nested item
   ```

2. Expressions are not allowed in picking path array

   **incorrect**

   ```js
   // expressions are not allowed
   const { user } = useGlobalStore.pick(["order", index + 1]);
   // string templates are not allowed
   const { user } = useGlobalStore.pick(["order", `#${orderId}`]);
   ```

   **correct**

   ```js
   // only use literals of String, Numbers or Booleans
   // and variables as elements of the path array
   const indexPlusOne = index + 1;
   const { user } = useGlobalStore.pick(["order", indexPlusOne, 0, true]);
   ```

3. Pick only accepts a single parameter:

   **incorrect**

   ```js
   const { user } = useGlobalStore.pick("order", "user");
   ```

   **correct**

   ```js
   // use arrays to specify nested path
   const { name } = useGlobalStore.pick(["order", "user"]);
   // use key directly to get its nested properties.
   const { user } = useGlobalStore.pick("order");
   // pass no arguments to get the top level properties
   const { order, setOrder } = useGlobalStore.pick();
   ```

## Notes

#### All nested property access are optional chained

No need to worry if any of the properties in your store nesting may be
null/undefined. This transformer adds optional chaining in all levels of
nesting. That is:

```js
const { order, customer } = useGlobalStore.pick([sessionId, "globals"]);
```

Will be transformed to:

```js
import { shallow } from "zustand/shallow";
const { order, customer } = useGlobalStore(
  store => ({
    order: store[sessionId]?.["globals"]?.["order"],
    customer: store[sessionId]?.["globals"]?.["customer"],
  }),
  shallow
);
```

So your code won't fail if `store[sessionId]` is null or
`store[sessionId].globals` is null.

#### This plugin should run on user's code

You might encounter errors if some other plugin transforms the code before
babel-plugin-neeto. **babel-plugin-neeto expects that it runs first on the code
before any other plugin performs transformations.**

If your zustand-pick syntax is correct, and you are still getting errors, check
for other babel-plugins or babel-presets transforming your code before we do.
