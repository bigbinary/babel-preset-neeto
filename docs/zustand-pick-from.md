# Zustand pickFrom transformer

## Motivation

When we created the Zustand pick transformer, we did not take into account, the
case to access a single property from a store. We were using the `pick`
transformer to access a single item.

```js
const { order } = useGlobalStore.pick([sessionId, "globals"]);
```

While there doesn't seem to be an issue, with using it this way, at the time of
bundling, the following is generated:

```js
import { shallow } from "zustand/shallow";

const { order, customer } = useGlobalStore(
  store => ({ order: store[sessionId]?.globals.order }),
  shallow
);
```

This gets the job done, but, it's very inefficient. Moreover, we don't even need
the `shallow` import for picking a single property.

For this reason, we have implemented the Zustand `pickFrom` transformer. The
`pickFrom` transformer transpiles the code to an efficient version for picking a
single item.

```js
const order = useGlobalStore.pickFrom([sessionId, "globals"]);
```

This will generate the following:

```js
const order = useGlobalStore.pickFrom(
  store => store[sessionId]?.globals?.order
);
```

## Allowed syntaxes

Consider this zustand store as an example.

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

```js
// picks `order` data from the store
const order = useGlobalStore.pickFrom();

// picks `user` from inside store.order
const user = useGlobalStore.pickFrom("order");

// picks `quantity` of dynamically obtained item of id `itemId`
const quantity = useGlobalStore.pickFrom(["order", "items", itemId]);
```

## Disallowed syntaxes

We have introduced a type definition for `pickFrom` method from zustand stores
from neeto-commons-frontend to make IDE capable of pointing out errors as you
type. But it is not 100% foolproof. So here is a list of usages that are flagged
as syntax errors during transpilation.

1. Destructuring is not allowed. If you want to use destructuring, use the
   `pick` method.

   **incorrect**

   ```js
   const { user } = useGlobalStore.pickFrom();
   ```

   **correct**

   ```js
   const user = useGlobalStore.pickFrom("order");
   ```

2. Expressions are not allowed in picking path array

   **incorrect**

   ```js
   // expressions are not allowed
   const user = useGlobalStore.pickFrom(["order", index + 1]);
   // string templates are not allowed
   const user = useGlobalStore.pickFrom(["order", `#${orderId}`]);
   ```

   **correct**

   ```js
   // only use literals of String, Numbers or Booleans
   // and variables as elements of the path array
   const indexPlusOne = index + 1;
   const user = useGlobalStore.pickFrom(["order", indexPlusOne, 0, true]);
   ```

3. PickFrom only accepts a single parameter:

   **incorrect**

   ```js
   const name = useGlobalStore.pickFrom("order", "user");
   ```

   **correct**

   ```js
   // use arrays to specify nested path
   const name = useGlobalStore.pickFrom(["order", "user"]);
   // use key directly to get its nested properties.
   const user = useGlobalStore.pickFrom("order");
   // pass no arguments to get the top level properties
   const order = useGlobalStore.pickFrom();
   ```

## Notes

#### All nested property access are optional chained

No need to worry if any of the properties in your store nesting may be
null/undefined. This transformer adds optional chaining in all levels of
nesting. That is:

```js
const order = useGlobalStore.pickFrom([sessionId, "globals"]);
```

Will be transformed to:

```js
const order = useGlobalStore(store => store[sessionId]?.["globals"]?.["order"]);
```

So your code won't fail if `store[sessionId]` is null or
`store[sessionId].globals` is null.

#### This plugin should run on user's code

You might encounter errors if some other plugin transforms the code before
babel-plugin-neeto. **babel-plugin-neeto expects that it runs first on the code
before any other plugin performs transformations.**

If your zustand-pick-from syntax is correct, and you are still getting errors,
check for other babel-plugins or babel-presets transforming your code before we
do.
