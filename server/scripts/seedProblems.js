import "../src/load-env.js";
import mongoose from "mongoose";
import { Problem } from "../src/models/Problem.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in .env");
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// Level 1 — Easy (15 problems, Junior Developers)
// ═══════════════════════════════════════════════════════════════════════════

const level1 = [
  {
    order: 1,
    title: "Create a simple Express route",
    prompt:
`Write a GET /hello route that returns { message: "Hello World" } as JSON.

Expected behaviour:
  GET /hello  →  200  { "message": "Hello World" }

Assume \`app\` (an Express instance) already exists. Write only the route.`,
    type: "codeSnippet",
    correctAnswer: `app.get('/hello', (req, res) => {\n  res.json({ message: 'Hello World' });\n});`,
    starterCode: `// TODO: Define a GET route at '/hello'
// TODO: In the handler, send a JSON response with { message: "Hello World" }
`,
    tags: ["express"],
    hints: ["Use app.get() and res.json()."],
  },
  {
    order: 2,
    title: "Basic Mongoose Schema",
    prompt:
`Define a Mongoose schema for a User with the following fields:
  • name  — String, required
  • email — String, required, unique
  • age   — Number

Create the model and export it (CommonJS or ESM, either is fine).`,
    type: "codeSnippet",
    correctAnswer: `const mongoose = require('mongoose');\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, required: true, unique: true },\n  age: Number,\n});\nmodule.exports = mongoose.model('User', userSchema);`,
    starterCode: `// TODO: Import mongoose
// TODO: Create a schema with name (String, required), email (String, required, unique), age (Number)
// TODO: Create and export the User model
`,
    tags: ["mongoose", "mongodb"],
    hints: ["Use mongoose.Schema with required and unique options."],
  },
  {
    order: 3,
    title: "Simple React Counter Component",
    prompt:
`Create a functional React component called Counter with:
  • A count state starting at 0 (use useState).
  • A <p> displaying the current count.
  • A <button> labelled "Increment" that increases count by 1 on click.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import { useState } from 'react';\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}`,
    starterCode: `// TODO: Import useState from 'react'
// TODO: Create and export default function Counter
// TODO: Declare a count state variable, initialized to 0
// TODO: Return JSX with a <p> showing count and a <button> that increments it
`,
    tags: ["react"],
    hints: ["const [count, setCount] = useState(0)"],
  },
  {
    order: 4,
    title: "Express POST route for adding a task",
    prompt:
`Create a POST /tasks route that:
  1. Reads { title } from req.body.
  2. Generates an id (use Date.now() or any simple method).
  3. Returns the object { id, title } as JSON with status 201.

Assume express.json() middleware is already applied.`,
    type: "codeSnippet",
    correctAnswer: `app.post('/tasks', (req, res) => {\n  const { title } = req.body;\n  const id = Date.now();\n  res.status(201).json({ id, title });\n});`,
    starterCode: `// TODO: Define a POST route at '/tasks'
// TODO: Extract title from req.body
// TODO: Generate a simple id (e.g. Date.now())
// TODO: Respond with status 201 and JSON { id, title }
`,
    tags: ["express"],
    hints: ["req.body.title, res.status(201).json(...)"],
  },
  {
    order: 5,
    title: "Filter array in React",
    prompt:
`Write a functional component called IncompleteTasks that:
  • Receives a prop tasks (array of objects with { id, title, completed }).
  • Renders only tasks where completed is false.
  • Display each matching task's title in a <li> inside a <ul>.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `export default function IncompleteTasks({ tasks }) {\n  return (\n    <ul>\n      {tasks.filter(t => !t.completed).map(t => (\n        <li key={t.id}>{t.title}</li>\n      ))}\n    </ul>\n  );\n}`,
    starterCode: `// TODO: Create and export default function IncompleteTasks that accepts { tasks } prop
// TODO: Filter the tasks array to keep only items where completed is false
// TODO: Map the filtered results into <li> elements inside a <ul>
`,
    tags: ["react"],
    hints: ["Use .filter() before .map()."],
  },
  {
    order: 6,
    title: "MongoDB query — find all users",
    prompt:
`Write an async function called getAllUsers that:
  1. Uses Mongoose to find and return all documents from the User model.
  2. Returns the array of users.

Assume the User model is already imported.`,
    type: "codeSnippet",
    correctAnswer: `async function getAllUsers() {\n  const users = await User.find();\n  return users;\n}`,
    starterCode: `// TODO: Declare an async function called getAllUsers
// TODO: Use User.find() with await to get all users
// TODO: Return the users array
`,
    tags: ["mongoose"],
    hints: ["await User.find()"],
  },
  {
    order: 7,
    title: "React form with useState",
    prompt:
`Build a React component called ContactForm with:
  • Two controlled inputs: name and email (use useState for each).
  • An onSubmit handler that calls e.preventDefault() and logs
    { name, email } to the console.
  • A submit button labelled "Submit".

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import { useState } from 'react';\nexport default function ContactForm() {\n  const [name, setName] = useState('');\n  const [email, setEmail] = useState('');\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log({ name, email });\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={e => setName(e.target.value)} placeholder=\"Name\" />\n      <input value={email} onChange={e => setEmail(e.target.value)} placeholder=\"Email\" />\n      <button type=\"submit\">Submit</button>\n    </form>\n  );\n}`,
    starterCode: `// TODO: Import useState from 'react'
// TODO: Create and export default function ContactForm
// TODO: Declare state variables for name and email (both start as '')
// TODO: Write a handleSubmit that prevents default and logs { name, email }
// TODO: Return a <form> with two controlled <input>s and a submit <button>
`,
    tags: ["react"],
    hints: ["useState for each field, e.preventDefault() on submit."],
  },
  {
    order: 8,
    title: "Express middleware to log requests",
    prompt:
`Create an Express middleware function called logger that logs the HTTP method and URL of every incoming request in the format:
  "[METHOD] /path"

Then calls next(). Register it with app.use().`,
    type: "codeSnippet",
    correctAnswer: `function logger(req, res, next) {\n  console.log(\`[\${req.method}] \${req.url}\`);\n  next();\n}\napp.use(logger);`,
    starterCode: `// TODO: Define a function called logger with parameters (req, res, next)
// TODO: Log the request method and URL in format "[METHOD] /path"
// TODO: Call next() to pass control to the next middleware
// TODO: Register the middleware with app.use(logger)
`,
    tags: ["express"],
    hints: ["req.method and req.url, then call next()."],
  },
  {
    order: 9,
    title: "Display list from array in React",
    prompt:
`Write a component called ItemList that:
  • Receives a prop items (array of strings).
  • Renders each string as an <li> inside a <ul>.
  • Uses the array index as the key.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `export default function ItemList({ items }) {\n  return (\n    <ul>\n      {items.map((item, i) => <li key={i}>{item}</li>)}\n    </ul>\n  );\n}`,
    starterCode: `// TODO: Create and export default function ItemList that accepts { items } prop
// TODO: Return a <ul> element
// TODO: Map over items, rendering each as an <li> with key={index}
`,
    tags: ["react"],
    hints: ["items.map((item, i) => <li key={i}>{item}</li>)"],
  },
  {
    order: 10,
    title: "Basic JWT token generation simulation",
    prompt:
`Write a function called generateFakeToken that:
  • Takes a user object (with at least an id property).
  • Returns the string: "token_<user.id>"

Example: generateFakeToken({ id: 42 }) → "token_42"`,
    type: "codeSnippet",
    correctAnswer: `function generateFakeToken(user) {\n  return \`token_\${user.id}\`;\n}`,
    starterCode: `// TODO: Define a function called generateFakeToken that takes a user object
// TODO: Return a string in the format "token_<user.id>" using a template literal
`,
    tags: ["node", "jwt"],
    hints: ["Template literal: `token_${user.id}`"],
  },
  {
    order: 11,
    title: "Update document in MongoDB",
    prompt:
`Write an async function called updateUserAge that:
  1. Accepts userId and newAge.
  2. Uses Mongoose to find the user by id and update the age field.
  3. Returns the updated user document.

Assume User model is imported.`,
    type: "codeSnippet",
    correctAnswer: `async function updateUserAge(userId, newAge) {\n  const user = await User.findByIdAndUpdate(userId, { age: newAge }, { new: true });\n  return user;\n}`,
    starterCode: `// TODO: Declare an async function called updateUserAge(userId, newAge)
// TODO: Use User.findByIdAndUpdate() to update the age field
// TODO: Pass { new: true } option to return the updated document
// TODO: Return the updated user
`,
    tags: ["mongoose"],
    hints: ["User.findByIdAndUpdate(id, update, { new: true })"],
  },
  {
    order: 12,
    title: "React conditional rendering",
    prompt:
`Write a component called AuthStatus that:
  • Receives a prop isLoggedIn (boolean).
  • If true, renders <p>Logged In</p>.
  • If false, renders <p>Please Login</p>.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `export default function AuthStatus({ isLoggedIn }) {\n  return <p>{isLoggedIn ? 'Logged In' : 'Please Login'}</p>;\n}`,
    starterCode: `// TODO: Create and export default function AuthStatus that accepts { isLoggedIn } prop
// TODO: Use a ternary operator to render "Logged In" or "Please Login" inside a <p>
`,
    tags: ["react"],
    hints: ["Ternary inside JSX: condition ? a : b"],
  },
  {
    order: 13,
    title: "Express error response",
    prompt:
`Create a GET /missing route that always returns:
  • Status 404
  • JSON body: { error: "Not Found" }

Write only the route.`,
    type: "codeSnippet",
    correctAnswer: `app.get('/missing', (req, res) => {\n  res.status(404).json({ error: 'Not Found' });\n});`,
    starterCode: `// TODO: Define a GET route at '/missing'
// TODO: Respond with status 404 and JSON { error: "Not Found" }
`,
    tags: ["express"],
    hints: ["res.status(404).json(...)"],
  },
  {
    order: 14,
    title: "Simple useEffect in React",
    prompt:
`Write a component called DataLoader that:
  1. Uses useState to hold an items array (initially []).
  2. Uses useEffect to fetch from '/api/items' on mount.
  3. Parses the JSON and stores it in state.
  4. Renders each item's name in a <li> inside a <ul>.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import { useState, useEffect } from 'react';\nexport default function DataLoader() {\n  const [items, setItems] = useState([]);\n  useEffect(() => {\n    fetch('/api/items')\n      .then(res => res.json())\n      .then(data => setItems(data));\n  }, []);\n  return (\n    <ul>\n      {items.map(item => <li key={item._id}>{item.name}</li>)}\n    </ul>\n  );\n}`,
    starterCode: `// TODO: Import useState and useEffect from 'react'
// TODO: Create and export default function DataLoader
// TODO: Declare items state (initially an empty array)
// TODO: Use useEffect with empty deps [] to fetch '/api/items' on mount
// TODO: Parse JSON and call setItems with the data
// TODO: Render items as <li> elements inside a <ul>
`,
    tags: ["react"],
    hints: ["useEffect with empty deps array [] runs once on mount."],
  },
  {
    order: 15,
    title: "Delete item from array in React state",
    prompt:
`Write a component called TaskList that:
  1. Uses useState with an initial array: ["Task A", "Task B", "Task C"].
  2. Renders each task in a <li> with a "Remove" <button>.
  3. Clicking "Remove" deletes that item by index from state.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import { useState } from 'react';\nexport default function TaskList() {\n  const [tasks, setTasks] = useState(['Task A', 'Task B', 'Task C']);\n  const remove = (index) => {\n    setTasks(tasks.filter((_, i) => i !== index));\n  };\n  return (\n    <ul>\n      {tasks.map((task, i) => (\n        <li key={i}>{task} <button onClick={() => remove(i)}>Remove</button></li>\n      ))}\n    </ul>\n  );\n}`,
    starterCode: `// TODO: Import useState from 'react'
// TODO: Create and export default function TaskList
// TODO: Declare tasks state initialized with ['Task A', 'Task B', 'Task C']
// TODO: Write a remove(index) function that filters out the item at that index
// TODO: Render each task in a <li> with a "Remove" button that calls remove(i)
`,
    tags: ["react"],
    hints: ["Filter by index: tasks.filter((_, i) => i !== index)"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Level 2 — Medium (15 problems, Mid-Level Developers)
// ═══════════════════════════════════════════════════════════════════════════

const level2 = [
  {
    order: 1,
    title: "Implement pagination in Express + Mongoose",
    prompt:
`Create a GET /users route that supports query params ?page=1&limit=10.

It should:
  1. Default page to 1 and limit to 10 if not provided.
  2. Use .skip() and .limit() on the User model.
  3. Also query the total count of users.
  4. Return JSON: { users: [...], total, page, limit }.`,
    type: "codeSnippet",
    correctAnswer: `app.get('/users', async (req, res) => {\n  const page = parseInt(req.query.page) || 1;\n  const limit = parseInt(req.query.limit) || 10;\n  const skip = (page - 1) * limit;\n  const [users, total] = await Promise.all([\n    User.find().skip(skip).limit(limit),\n    User.countDocuments(),\n  ]);\n  res.json({ users, total, page, limit });\n});`,
    starterCode: `// TODO: Define a GET '/users' route with async handler
// TODO: Parse page and limit from req.query (default to 1 and 10)
// TODO: Calculate skip value as (page - 1) * limit
// TODO: Use Promise.all to run User.find().skip().limit() and User.countDocuments() in parallel
// TODO: Return JSON with { users, total, page, limit }
`,
    tags: ["express", "mongoose"],
    hints: ["skip = (page - 1) * limit; use .skip().limit() and countDocuments()."],
  },
  {
    order: 2,
    title: "Custom debounce hook in React",
    prompt:
`Create a custom hook called useDebounce that:
  1. Accepts a value and a delay (in ms, default 300).
  2. Returns the debounced value.
  3. Only updates the returned value after the caller stops changing the input for the given delay.

Export as a named export.`,
    type: "codeSnippet",
    correctAnswer: `import { useState, useEffect } from 'react';\nexport function useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}`,
    starterCode: `// TODO: Import useState and useEffect from 'react'
// TODO: Export a function useDebounce(value, delay = 300)
// TODO: Declare a debounced state initialized with value
// TODO: useEffect: set a timeout that updates debounced after delay ms
// TODO: Return clearTimeout as the cleanup function
// TODO: Return the debounced value
`,
    tags: ["react"],
    hints: ["setTimeout inside useEffect; return clearTimeout as cleanup."],
  },
  {
    order: 3,
    title: "Zod validation middleware for Express",
    prompt:
`Using the Zod library, create:
  1. A schema called taskSchema that validates:
       • title — string, min length 1 (required)
       • status — enum of ["todo", "in-progress", "done"]
  2. A middleware function called validate that:
       • Parses req.body against taskSchema.
       • If invalid, returns 400 with { errors: <zod error messages> }.
       • If valid, calls next().

Assume zod is imported as: import { z } from 'zod';`,
    type: "codeSnippet",
    correctAnswer: `import { z } from 'zod';\nconst taskSchema = z.object({\n  title: z.string().min(1),\n  status: z.enum(['todo', 'in-progress', 'done']),\n});\nfunction validate(req, res, next) {\n  const result = taskSchema.safeParse(req.body);\n  if (!result.success) {\n    return res.status(400).json({ errors: result.error.errors });\n  }\n  next();\n}`,
    starterCode: `// TODO: Import { z } from 'zod'
// TODO: Define taskSchema using z.object() with title (string, min 1) and status (enum)
// TODO: Write a validate middleware function
// TODO: Use taskSchema.safeParse(req.body) to validate
// TODO: If not successful, return 400 with the error details
// TODO: If valid, call next()
`,
    tags: ["express", "validation"],
    hints: ["z.object({ ... }), safeParse(), check result.success."],
  },
  {
    order: 4,
    title: "TanStack Query data fetching in React",
    prompt:
`Refactor data fetching to use TanStack Query (React Query).

Write a component called UserList that:
  1. Uses useQuery with key ['users'] to fetch from '/api/users'.
  2. Shows "Loading..." while loading.
  3. Shows the error message if there's an error.
  4. Renders each user's name in a <li>.

Assume @tanstack/react-query is installed and a QueryClientProvider wraps the app.`,
    type: "codeSnippet",
    correctAnswer: `import { useQuery } from '@tanstack/react-query';\nexport default function UserList() {\n  const { data, isLoading, error } = useQuery({\n    queryKey: ['users'],\n    queryFn: () => fetch('/api/users').then(res => res.json()),\n  });\n  if (isLoading) return <p>Loading...</p>;\n  if (error) return <p>{error.message}</p>;\n  return (\n    <ul>\n      {data.map(user => <li key={user._id}>{user.name}</li>)}\n    </ul>\n  );\n}`,
    starterCode: `// TODO: Import useQuery from '@tanstack/react-query'
// TODO: Export default function UserList
// TODO: Call useQuery with queryKey: ['users'] and a queryFn that fetches '/api/users'
// TODO: Destructure { data, isLoading, error } from the result
// TODO: Return "Loading..." if isLoading
// TODO: Return error message if error exists
// TODO: Map data into <li> elements showing user names
`,
    tags: ["react", "react-query"],
    hints: ["useQuery({ queryKey, queryFn }) returns { data, isLoading, error }."],
  },
  {
    order: 5,
    title: "Service layer extraction",
    prompt:
`You have this controller code mixed with DB logic:

  app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  });

Refactor by:
  1. Creating a userService object with a method getUserById(id) that contains the DB call.
  2. Rewriting the route to use userService.getUserById.

Write both the service object and the refactored route.`,
    type: "codeSnippet",
    correctAnswer: `const userService = {\n  async getUserById(id) {\n    return await User.findById(id);\n  },\n};\n\napp.get('/api/users/:id', async (req, res) => {\n  const user = await userService.getUserById(req.params.id);\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  res.json(user);\n});`,
    starterCode: `// TODO: Create a userService object with an async method getUserById(id)
// TODO: Inside getUserById, call and return User.findById(id)
// TODO: Rewrite the GET '/api/users/:id' route to use userService.getUserById
// TODO: Handle the not-found case with 404
`,
    tags: ["express", "architecture"],
    hints: ["Move DB calls into a separate object/module; the route only calls the service."],
  },
  {
    order: 6,
    title: "React form with React Hook Form + Zod",
    prompt:
`Build a React component called RegisterForm using React Hook Form and Zod.

Validation rules:
  • email — valid email format, required.
  • password — string, min 6 chars, required.
  • confirmPassword — must match password.

On valid submit, log the form data to console. Show error messages below each field.
Export as default. Assume react-hook-form, @hookform/resolvers, and zod are installed.`,
    type: "codeSnippet",
    correctAnswer: `import { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport { z } from 'zod';\n\nconst schema = z.object({\n  email: z.string().email(),\n  password: z.string().min(6),\n  confirmPassword: z.string(),\n}).refine(d => d.password === d.confirmPassword, {\n  message: 'Passwords must match',\n  path: ['confirmPassword'],\n});\n\nexport default function RegisterForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });\n  const onSubmit = (data) => console.log(data);\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register('email')} placeholder=\"Email\" />\n      {errors.email && <p>{errors.email.message}</p>}\n      <input type=\"password\" {...register('password')} placeholder=\"Password\" />\n      {errors.password && <p>{errors.password.message}</p>}\n      <input type=\"password\" {...register('confirmPassword')} placeholder=\"Confirm\" />\n      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}\n      <button type=\"submit\">Register</button>\n    </form>\n  );\n}`,
    starterCode: `// TODO: Import useForm, zodResolver, and z
// TODO: Define a Zod schema with email, password (min 6), and confirmPassword
// TODO: Add a .refine() to check that password === confirmPassword
// TODO: Export default function RegisterForm
// TODO: Call useForm with zodResolver(schema)
// TODO: Render a form with three inputs, error messages, and a submit button
`,
    tags: ["react", "validation"],
    hints: ["Use zodResolver(schema) with useForm. Use .refine() for password match."],
  },
  {
    order: 7,
    title: "MongoDB aggregation for average age",
    prompt:
`Write a Mongoose aggregation pipeline that calculates the average age of all users in the User collection.

Return the result from an async function called getAverageAge.
The pipeline should use $group with $avg.
Expected output shape: [{ _id: null, averageAge: <number> }].`,
    type: "codeSnippet",
    correctAnswer: `async function getAverageAge() {\n  const result = await User.aggregate([\n    { $group: { _id: null, averageAge: { $avg: '$age' } } },\n  ]);\n  return result;\n}`,
    starterCode: `// TODO: Declare an async function called getAverageAge
// TODO: Use User.aggregate() with a pipeline array
// TODO: Add a $group stage: _id: null, averageAge: { $avg: '$age' }
// TODO: Return the aggregation result
`,
    tags: ["mongoose", "mongodb"],
    hints: ["$group: { _id: null, averageAge: { $avg: '$age' } }"],
  },
  {
    order: 8,
    title: "Optimistic update with React Query",
    prompt:
`Implement a todo toggle using useMutation from TanStack Query with optimistic update.

Write a function or hook that:
  1. Uses useMutation to POST to '/api/todos/:id/toggle'.
  2. In onMutate: cancels outgoing queries, snapshots current data, and optimistically toggles the completed field.
  3. In onError: rolls back to the snapshot.
  4. In onSettled: invalidates the ['todos'] query.

Assume queryClient is available via useQueryClient().`,
    type: "codeSnippet",
    correctAnswer: `import { useMutation, useQueryClient } from '@tanstack/react-query';\n\nexport function useToggleTodo() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (id) => fetch(\`/api/todos/\${id}/toggle\`, { method: 'POST' }).then(r => r.json()),\n    onMutate: async (id) => {\n      await queryClient.cancelQueries({ queryKey: ['todos'] });\n      const previous = queryClient.getQueryData(['todos']);\n      queryClient.setQueryData(['todos'], old =>\n        old.map(t => t._id === id ? { ...t, completed: !t.completed } : t)\n      );\n      return { previous };\n    },\n    onError: (err, id, context) => {\n      queryClient.setQueryData(['todos'], context.previous);\n    },\n    onSettled: () => {\n      queryClient.invalidateQueries({ queryKey: ['todos'] });\n    },\n  });\n}`,
    starterCode: `// TODO: Import useMutation and useQueryClient from '@tanstack/react-query'
// TODO: Export a hook called useToggleTodo
// TODO: Get queryClient via useQueryClient()
// TODO: Return useMutation with:
//   - mutationFn: POST to '/api/todos/:id/toggle'
//   - onMutate: cancel queries, snapshot data, optimistically toggle completed
//   - onError: rollback to snapshot using context.previous
//   - onSettled: invalidate the ['todos'] query
`,
    tags: ["react", "react-query"],
    hints: ["onMutate → snapshot + optimistic update; onError → rollback; onSettled → invalidate."],
  },
  {
    order: 9,
    title: "Express rate limiting middleware",
    prompt:
`Apply rate limiting to all /api routes using express-rate-limit.

Configuration:
  • Max 100 requests per 15 minutes per IP.
  • Use standard headers.

Write the import, configuration, and app.use() call.`,
    type: "codeSnippet",
    correctAnswer: `const rateLimit = require('express-rate-limit');\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  standardHeaders: true,\n  legacyHeaders: false,\n});\napp.use('/api', limiter);`,
    starterCode: `// TODO: Import/require express-rate-limit
// TODO: Create a limiter with windowMs (15 min), max (100), standardHeaders (true)
// TODO: Apply the limiter to '/api' routes with app.use()
`,
    tags: ["express", "security"],
    hints: ["windowMs: 15 * 60 * 1000, max: 100, apply to '/api' path."],
  },
  {
    order: 10,
    title: "Infinite scroll simulation in React",
    prompt:
`Write a component called InfiniteList that:
  1. Holds a static master array of 100 items (generate with Array.from).
  2. Uses useState to track how many items are visible (start with 20).
  3. Has a "Load More" button that adds 20 more items to the visible list.
  4. Renders each visible item in a <li>.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import { useState } from 'react';\nconst allItems = Array.from({ length: 100 }, (_, i) => \`Item \${i + 1}\`);\nexport default function InfiniteList() {\n  const [visible, setVisible] = useState(20);\n  return (\n    <div>\n      <ul>\n        {allItems.slice(0, visible).map((item, i) => <li key={i}>{item}</li>)}\n      </ul>\n      {visible < allItems.length && (\n        <button onClick={() => setVisible(v => Math.min(v + 20, allItems.length))}>Load More</button>\n      )}\n    </div>\n  );\n}`,
    starterCode: `// TODO: Import useState from 'react'
// TODO: Create allItems array with 100 items using Array.from
// TODO: Export default function InfiniteList
// TODO: Track visible count in state (start at 20)
// TODO: Render allItems.slice(0, visible) as <li> elements
// TODO: Show a "Load More" button that increases visible by 20 (if more items remain)
`,
    tags: ["react"],
    hints: ["allItems.slice(0, visible); button increments visible by 20."],
  },
  {
    order: 11,
    title: "Soft delete implementation",
    prompt:
`Write an Express DELETE route at '/api/users/:id' that performs a soft delete:
  1. Instead of removing the document, set isDeleted: true and deletedAt: new Date().
  2. Use findByIdAndUpdate.
  3. Return { message: 'Soft deleted' } or 404 if not found.`,
    type: "codeSnippet",
    correctAnswer: `app.delete('/api/users/:id', async (req, res) => {\n  const user = await User.findByIdAndUpdate(\n    req.params.id,\n    { isDeleted: true, deletedAt: new Date() },\n    { new: true }\n  );\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  res.json({ message: 'Soft deleted' });\n});`,
    starterCode: `// TODO: Define a DELETE route at '/api/users/:id' with async handler
// TODO: Use User.findByIdAndUpdate to set isDeleted: true and deletedAt: new Date()
// TODO: If user not found, return 404 with error
// TODO: Otherwise return { message: 'Soft deleted' }
`,
    tags: ["express", "mongoose"],
    hints: ["Set isDeleted: true instead of deleting the document."],
  },
  {
    order: 12,
    title: "Protected route in React",
    prompt:
`Create a component called ProtectedRoute that:
  1. Checks if a token exists in localStorage (key: 'token').
  2. If it exists, renders the children.
  3. If not, redirects to '/login' using Navigate from react-router-dom.

Export as default. Accept children as a prop.`,
    type: "codeSnippet",
    correctAnswer: `import { Navigate } from 'react-router-dom';\nexport default function ProtectedRoute({ children }) {\n  const token = localStorage.getItem('token');\n  if (!token) return <Navigate to=\"/login\" replace />;\n  return children;\n}`,
    starterCode: `// TODO: Import Navigate from 'react-router-dom'
// TODO: Export default function ProtectedRoute({ children })
// TODO: Check if localStorage has a 'token' key
// TODO: If no token, return <Navigate to="/login" replace />
// TODO: If token exists, return children
`,
    tags: ["react", "react-router"],
    hints: ["localStorage.getItem('token'), Navigate from react-router-dom."],
  },
  {
    order: 13,
    title: "Combine two MongoDB queries into one",
    prompt:
`You previously ran two separate queries:
  const user = await User.findById(id);
  const tasks = await Task.find({ userId: id });

The Task model has a userId field referencing User.

Optimize: add a virtual 'tasks' on the User schema that populates from the Task model, then fetch user + tasks in one call.

Write the virtual definition and the single query.`,
    type: "codeSnippet",
    correctAnswer: `userSchema.virtual('tasks', {\n  ref: 'Task',\n  localField: '_id',\n  foreignField: 'userId',\n});\n\nconst user = await User.findById(id).populate('tasks');`,
    starterCode: `// TODO: Define a virtual 'tasks' on userSchema with ref, localField, foreignField
// TODO: ref should be 'Task', localField '_id', foreignField 'userId'
// TODO: Use User.findById(id).populate('tasks') to fetch user with tasks in one query
`,
    tags: ["mongoose"],
    hints: ["schema.virtual('tasks', { ref, localField, foreignField }) + .populate('tasks')."],
  },
  {
    order: 14,
    title: "Dark mode toggle with Context API",
    prompt:
`Implement a React ThemeContext that:
  1. Creates a context with createContext.
  2. ThemeProvider reads initial theme from localStorage (key: 'theme', default 'light').
  3. Provides { theme, toggleTheme } where toggleTheme switches between 'light' and 'dark' and saves to localStorage.
  4. Export ThemeContext and ThemeProvider.`,
    type: "codeSnippet",
    correctAnswer: `import { createContext, useState } from 'react';\nexport const ThemeContext = createContext();\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');\n  const toggleTheme = () => {\n    const next = theme === 'light' ? 'dark' : 'light';\n    setTheme(next);\n    localStorage.setItem('theme', next);\n  };\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}`,
    starterCode: `// TODO: Import createContext and useState from 'react'
// TODO: Export a ThemeContext created with createContext()
// TODO: Export a ThemeProvider component that accepts { children }
// TODO: Read initial theme from localStorage (default to 'light')
// TODO: Write a toggleTheme function that flips the theme and saves to localStorage
// TODO: Wrap children in ThemeContext.Provider with value={{ theme, toggleTheme }}
`,
    tags: ["react"],
    hints: ["useState + localStorage; toggleTheme flips and persists."],
  },
  {
    order: 15,
    title: "Error boundary in React",
    prompt:
`Create a class-based React Error Boundary component called ErrorBoundary that:
  1. Catches errors using componentDidCatch.
  2. Stores hasError in state via getDerivedStateFromError.
  3. If hasError is true, renders <h2>Something went wrong.</h2>.
  4. Otherwise renders this.props.children.

Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import React from 'react';\nexport default class ErrorBoundary extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n  componentDidCatch(error, info) {\n    console.error(error, info);\n  }\n  render() {\n    if (this.state.hasError) return <h2>Something went wrong.</h2>;\n    return this.props.children;\n  }\n}`,
    starterCode: `// TODO: Import React
// TODO: Export default class ErrorBoundary extends React.Component
// TODO: In constructor, initialize state with { hasError: false }
// TODO: Add static getDerivedStateFromError() that returns { hasError: true }
// TODO: Add componentDidCatch(error, info) to log the error
// TODO: In render(), check hasError — show fallback or this.props.children
`,
    tags: ["react"],
    hints: ["getDerivedStateFromError returns { hasError: true }; render checks it."],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Level 3 — Hard (15 problems, Senior Developers)
// ═══════════════════════════════════════════════════════════════════════════

const level3 = [
  {
    order: 1,
    title: "Real-time task update with Socket.io",
    prompt:
`After updating a task's status on the backend, emit a Socket.io event so all connected clients receive the update.

Write:
  1. A PUT /tasks/:id route that updates the task's status field.
  2. After saving, emits a 'taskUpdated' event via io with the updated task.
  3. On the client side (React), a useEffect that listens for 'taskUpdated' and updates local state.

Assume io (server) and socket (client) are available. Write both server and client code.`,
    type: "codeSnippet",
    correctAnswer: `// Server\napp.put('/tasks/:id', async (req, res) => {\n  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });\n  if (!task) return res.status(404).json({ error: 'Not found' });\n  io.emit('taskUpdated', task);\n  res.json(task);\n});\n\n// Client (inside component)\nuseEffect(() => {\n  socket.on('taskUpdated', (updated) => {\n    setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));\n  });\n  return () => socket.off('taskUpdated');\n}, []);`,
    starterCode: `// === SERVER ===
// TODO: Define a PUT '/tasks/:id' route with async handler
// TODO: Use Task.findByIdAndUpdate to update the status field
// TODO: After saving, emit 'taskUpdated' event via io with the updated task
// TODO: Return the updated task as JSON

// === CLIENT (inside a React component) ===
// TODO: useEffect to listen for 'taskUpdated' events on the socket
// TODO: Update local tasks state by replacing the matching task
// TODO: Return a cleanup function that calls socket.off('taskUpdated')
`,
    tags: ["express", "socket.io", "react"],
    hints: ["io.emit('event', data) on server; socket.on('event', cb) on client."],
  },
  {
    order: 2,
    title: "Advanced MongoDB aggregation pipeline",
    prompt:
`Build an aggregation pipeline on a Task collection (fields: status, priority, title) that:
  1. Groups tasks by status.
  2. For each group, counts the number of tasks.
  3. Calculates the average priority.
  4. Sorts by count descending.

Write the full pipeline array.`,
    type: "codeSnippet",
    correctAnswer: `const pipeline = [\n  {\n    $group: {\n      _id: '$status',\n      count: { $sum: 1 },\n      avgPriority: { $avg: '$priority' },\n    },\n  },\n  { $sort: { count: -1 } },\n];\nconst result = await Task.aggregate(pipeline);`,
    starterCode: `// TODO: Define a pipeline array with aggregation stages
// TODO: Add a $group stage that groups by '$status'
// TODO: In the $group, count tasks with $sum: 1 and average priority with $avg: '$priority'
// TODO: Add a $sort stage to sort by count descending (-1)
// TODO: Run the pipeline with Task.aggregate(pipeline)
`,
    tags: ["mongodb", "mongoose"],
    hints: ["$group by status, $sum: 1 for count, $avg for priority, then $sort."],
  },
  {
    order: 3,
    title: "Role-based authorization middleware",
    prompt:
`Create an Express middleware factory called authorize that:
  1. Accepts a list of allowed roles (e.g. 'admin', 'user').
  2. Returns a middleware function that checks req.user.role (set by prior auth middleware).
  3. If the role is not in the allowed list, returns 403 with { error: 'Forbidden' }.
  4. Otherwise calls next().

Also show usage example: protect a DELETE route so only 'admin' can access it.`,
    type: "codeSnippet",
    correctAnswer: `function authorize(...roles) {\n  return (req, res, next) => {\n    if (!roles.includes(req.user.role)) {\n      return res.status(403).json({ error: 'Forbidden' });\n    }\n    next();\n  };\n}\n\n// Usage:\napp.delete('/api/users/:id', auth, authorize('admin'), async (req, res) => {\n  await User.findByIdAndDelete(req.params.id);\n  res.json({ message: 'Deleted' });\n});`,
    starterCode: `// TODO: Define function authorize(...roles) that returns a middleware
// TODO: The returned middleware checks if req.user.role is in the roles array
// TODO: If not included, return 403 with { error: 'Forbidden' }
// TODO: If included, call next()
// TODO: Show usage: protect a DELETE route with auth + authorize('admin')
`,
    tags: ["express", "security"],
    hints: ["Return a closure that checks req.user.role against the roles array."],
  },
  {
    order: 4,
    title: "Performance optimization — memoize heavy list",
    prompt:
`You have a parent component that re-renders often, causing a heavy child list to re-render unnecessarily.

Write:
  1. A memoized list item component (ListItem) using React.memo.
  2. A parent component that passes an onClick handler to each item.
  3. Use useCallback for the handler so it doesn't change on every render.
  4. Use useMemo if deriving any computed data.

Show the full parent + child code. Export the parent as default.`,
    type: "codeSnippet",
    correctAnswer: `import React, { useState, useCallback, useMemo } from 'react';\n\nconst ListItem = React.memo(({ item, onClick }) => {\n  return <li onClick={() => onClick(item.id)}>{item.name}</li>;\n});\n\nexport default function ItemList({ items }) {\n  const [selected, setSelected] = useState(null);\n  const handleClick = useCallback((id) => {\n    setSelected(id);\n  }, []);\n  const sorted = useMemo(() => [...items].sort((a, b) => a.name.localeCompare(b.name)), [items]);\n  return (\n    <div>\n      <p>Selected: {selected}</p>\n      <ul>\n        {sorted.map(item => <ListItem key={item.id} item={item} onClick={handleClick} />)}\n      </ul>\n    </div>\n  );\n}`,
    starterCode: `// TODO: Import React, useState, useCallback, useMemo
// TODO: Create a ListItem component wrapped in React.memo
// TODO: ListItem renders an <li> with item.name and calls onClick(item.id) on click
// TODO: Export default function ItemList({ items })
// TODO: Use useCallback for the click handler to keep a stable reference
// TODO: Use useMemo to sort items (only recompute when items change)
// TODO: Render the sorted list using ListItem components
`,
    tags: ["react", "performance"],
    hints: ["React.memo on child; useCallback for stable handler; useMemo for derived data."],
  },
  {
    order: 5,
    title: "File upload with Multer + metadata in MongoDB",
    prompt:
`Implement a file upload endpoint:
  1. Configure Multer to store files in an 'uploads/' directory.
  2. Create a POST /api/upload route that accepts a single file (field name: 'avatar').
  3. After upload, save metadata to a File model: { filename, size, userId } where userId comes from req.user.id.
  4. Return the saved metadata as JSON.

Assume: multer and the File model are available; auth middleware sets req.user.`,
    type: "codeSnippet",
    correctAnswer: `const multer = require('multer');\nconst upload = multer({ dest: 'uploads/' });\n\napp.post('/api/upload', auth, upload.single('avatar'), async (req, res) => {\n  const fileMeta = await File.create({\n    filename: req.file.filename,\n    size: req.file.size,\n    userId: req.user.id,\n  });\n  res.json(fileMeta);\n});`,
    starterCode: `// TODO: Import/require multer
// TODO: Configure multer with dest: 'uploads/'
// TODO: Define POST '/api/upload' route with auth middleware and upload.single('avatar')
// TODO: Create a File document with filename, size, userId from req.file and req.user
// TODO: Return the saved file metadata as JSON
`,
    tags: ["express", "multer", "mongoose"],
    hints: ["multer({ dest }), upload.single('avatar'), save req.file info to DB."],
  },
  {
    order: 6,
    title: "Cursor-based pagination",
    prompt:
`Implement cursor-based pagination for a large collection instead of offset-based (skip/limit).

Write a GET /api/posts route that:
  1. Accepts ?cursor=<lastId>&limit=10 query params.
  2. If cursor is provided, fetches documents with _id greater than cursor.
  3. Returns { posts: [...], nextCursor: <last post id or null> }.

Use Mongoose and sort by _id ascending.`,
    type: "codeSnippet",
    correctAnswer: `app.get('/api/posts', async (req, res) => {\n  const limit = parseInt(req.query.limit) || 10;\n  const cursor = req.query.cursor;\n  const query = cursor ? { _id: { $gt: cursor } } : {};\n  const posts = await Post.find(query).sort({ _id: 1 }).limit(limit);\n  const nextCursor = posts.length === limit ? posts[posts.length - 1]._id : null;\n  res.json({ posts, nextCursor });\n});`,
    starterCode: `// TODO: Define GET '/api/posts' route with async handler
// TODO: Parse limit from query params (default 10) and cursor
// TODO: Build query: if cursor exists, filter _id: { $gt: cursor }; otherwise empty
// TODO: Find posts with the query, sort by _id ascending, limit results
// TODO: Calculate nextCursor from the last post's _id (null if fewer results than limit)
// TODO: Return { posts, nextCursor }
`,
    tags: ["express", "mongoose", "performance"],
    hints: ["Use { _id: { $gt: cursor } } instead of skip. Sort by _id: 1."],
  },
  {
    order: 7,
    title: "Advanced filtering + sorting + pagination endpoint",
    prompt:
`Build a GET /api/products route that supports all of the following via query params:
  • search — regex match on the title field (case-insensitive).
  • status — filter by status (can be comma-separated for multiple values, e.g. "active,archived").
  • minPrice / maxPrice — numeric range filter on price field.
  • sortBy — field name to sort by (default: 'createdAt').
  • order — 'asc' or 'desc' (default: 'desc').
  • page / limit — offset pagination.

Return { products, total, page, limit }.`,
    type: "codeSnippet",
    correctAnswer: `app.get('/api/products', async (req, res) => {\n  const { search, status, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;\n  const filter = {};\n  if (search) filter.title = { $regex: search, $options: 'i' };\n  if (status) filter.status = { $in: status.split(',') };\n  if (minPrice || maxPrice) {\n    filter.price = {};\n    if (minPrice) filter.price.$gte = Number(minPrice);\n    if (maxPrice) filter.price.$lte = Number(maxPrice);\n  }\n  const skip = (Number(page) - 1) * Number(limit);\n  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };\n  const [products, total] = await Promise.all([\n    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),\n    Product.countDocuments(filter),\n  ]);\n  res.json({ products, total, page: Number(page), limit: Number(limit) });\n});`,
    starterCode: `// TODO: Define GET '/api/products' route with async handler
// TODO: Destructure search, status, minPrice, maxPrice, sortBy, order, page, limit from req.query
// TODO: Build a filter object dynamically:
//   - If search: add title regex (case-insensitive)
//   - If status: split by comma and use $in
//   - If minPrice/maxPrice: add $gte/$lte on price
// TODO: Calculate skip for pagination
// TODO: Build sort object from sortBy and order
// TODO: Run find + countDocuments in parallel with Promise.all
// TODO: Return { products, total, page, limit }
`,
    tags: ["express", "mongoose"],
    hints: ["Build filter object dynamically; $regex for search; $in for status array; $gte/$lte for range."],
  },
  {
    order: 8,
    title: "Background job simulation with queue",
    prompt:
`Simulate a background job system:
  1. Create a simple in-memory job queue (array).
  2. Write an enqueue(job) function that pushes a job and starts processing.
  3. The processor runs jobs asynchronously (simulate with setTimeout of 2 seconds per job).
  4. In a POST /register route, after saving the user, enqueue a job { type: 'sendWelcomeEmail', userId: user._id }.
  5. The processor logs "Sending welcome email to <userId>" when it runs.

Write the queue, processor, and route.`,
    type: "codeSnippet",
    correctAnswer: `const queue = [];\nlet processing = false;\n\nfunction enqueue(job) {\n  queue.push(job);\n  if (!processing) processQueue();\n}\n\nasync function processQueue() {\n  processing = true;\n  while (queue.length > 0) {\n    const job = queue.shift();\n    await new Promise(resolve => setTimeout(resolve, 2000));\n    if (job.type === 'sendWelcomeEmail') {\n      console.log(\`Sending welcome email to \${job.userId}\`);\n    }\n  }\n  processing = false;\n}\n\napp.post('/register', async (req, res) => {\n  const user = await User.create(req.body);\n  enqueue({ type: 'sendWelcomeEmail', userId: user._id });\n  res.status(201).json(user);\n});`,
    starterCode: `// TODO: Create an empty queue array and a processing flag (false)
// TODO: Write enqueue(job) — push job; if not processing, call processQueue()
// TODO: Write async processQueue() — set processing true; loop while queue has items
//   - Shift a job, await a 2-second setTimeout, then handle the job by type
// TODO: Define POST '/register' route
//   - Create a user, enqueue a 'sendWelcomeEmail' job, return 201
`,
    tags: ["node", "express", "architecture"],
    hints: ["Array as queue; shift() to dequeue; setTimeout to simulate async work."],
  },
  {
    order: 9,
    title: "Secure password reset flow (backend only)",
    prompt:
`Implement a password reset flow with two routes:

POST /api/forgot-password
  1. Find user by email from req.body.
  2. Generate a random token (crypto.randomBytes).
  3. Hash it and save resetToken + resetExpires (1 hour) on the user doc.
  4. Return the unhashed token (in real app you'd email it).

POST /api/reset-password
  1. Accept { token, newPassword } from req.body.
  2. Hash the incoming token.
  3. Find a user with matching resetToken and resetExpires > now.
  4. Hash the new password with bcrypt and save it.
  5. Clear resetToken and resetExpires.

Assume bcrypt and crypto are imported; User model has the necessary fields.`,
    type: "codeSnippet",
    correctAnswer: `const crypto = require('crypto');\nconst bcrypt = require('bcrypt');\n\napp.post('/api/forgot-password', async (req, res) => {\n  const user = await User.findOne({ email: req.body.email });\n  if (!user) return res.status(404).json({ error: 'User not found' });\n  const token = crypto.randomBytes(32).toString('hex');\n  user.resetToken = crypto.createHash('sha256').update(token).digest('hex');\n  user.resetExpires = Date.now() + 60 * 60 * 1000;\n  await user.save();\n  res.json({ token });\n});\n\napp.post('/api/reset-password', async (req, res) => {\n  const { token, newPassword } = req.body;\n  const hashed = crypto.createHash('sha256').update(token).digest('hex');\n  const user = await User.findOne({ resetToken: hashed, resetExpires: { $gt: Date.now() } });\n  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });\n  user.password = await bcrypt.hash(newPassword, 10);\n  user.resetToken = undefined;\n  user.resetExpires = undefined;\n  await user.save();\n  res.json({ message: 'Password reset successful' });\n});`,
    starterCode: `// TODO: Import crypto and bcrypt

// POST /api/forgot-password
// TODO: Find user by email
// TODO: Generate a random token with crypto.randomBytes(32).toString('hex')
// TODO: Hash the token with sha256 and save as user.resetToken
// TODO: Set user.resetExpires to 1 hour from now
// TODO: Save user and return the unhashed token

// POST /api/reset-password
// TODO: Extract { token, newPassword } from req.body
// TODO: Hash the incoming token with sha256
// TODO: Find user with matching resetToken and resetExpires > Date.now()
// TODO: Hash newPassword with bcrypt and save; clear reset fields
`,
    tags: ["express", "security"],
    hints: ["Hash token with sha256 for storage; compare hashed versions; check expiry with $gt."],
  },
  {
    order: 10,
    title: "React performance audit fix",
    prompt:
`The following component re-renders excessively. Identify the issues and write the fixed version.

  function Dashboard({ userId }) {
    const [data, setData] = useState(null);
    const config = { headers: { Authorization: 'Bearer token' } };

    useEffect(() => {
      fetch('/api/dashboard', config).then(r => r.json()).then(setData);
    }, [config]);

    const format = (item) => ({ ...item, label: item.name.toUpperCase() });
    const items = data ? data.map(format) : [];

    return <ItemList items={items} onSelect={(id) => console.log(id)} />;
  }

Problems to fix:
  • config recreated every render → infinite useEffect loop.
  • items recreated every render → child re-renders.
  • onSelect is a new function every render.

Rewrite the entire component with fixes. Export as default.`,
    type: "codeSnippet",
    correctAnswer: `import { useState, useEffect, useMemo, useCallback } from 'react';\n\nconst config = { headers: { Authorization: 'Bearer token' } };\n\nexport default function Dashboard({ userId }) {\n  const [data, setData] = useState(null);\n\n  useEffect(() => {\n    fetch('/api/dashboard', config).then(r => r.json()).then(setData);\n  }, []);\n\n  const items = useMemo(() => {\n    if (!data) return [];\n    return data.map(item => ({ ...item, label: item.name.toUpperCase() }));\n  }, [data]);\n\n  const onSelect = useCallback((id) => {\n    console.log(id);\n  }, []);\n\n  return <ItemList items={items} onSelect={onSelect} />;\n}`,
    starterCode: `// TODO: Import useState, useEffect, useMemo, useCallback
// TODO: Move the static config object OUTSIDE the component
// TODO: Export default function Dashboard({ userId })
// TODO: Use useEffect with stable deps (empty []) for fetching
// TODO: Wrap the items derivation in useMemo (depend on [data])
// TODO: Wrap onSelect in useCallback with stable deps
// TODO: Render ItemList with memoized items and onSelect
`,
    tags: ["react", "performance"],
    hints: ["Move config outside; useMemo for derived data; useCallback for handlers; stable deps in useEffect."],
  },
  {
    order: 11,
    title: "Implement refresh token rotation",
    prompt:
`Implement JWT refresh token rotation:

POST /api/login
  1. Validate credentials (assume valid if user found and password matches with bcrypt).
  2. Issue a short-lived access token (15 min) and a refresh token (7 days).
  3. Store hashed refresh token on the user document.
  4. Return access token in JSON; set refresh token as httpOnly cookie.

POST /api/refresh
  1. Read refresh token from cookies.
  2. Verify it and find the user.
  3. Compare hash of the cookie token with user.refreshToken.
  4. Issue a new access + refresh token pair (rotation).
  5. Update stored hash.

Assume jwt, bcrypt, crypto are imported; User model has refreshToken field.`,
    type: "codeSnippet",
    correctAnswer: `const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcrypt');\nconst crypto = require('crypto');\n\nfunction hashToken(token) {\n  return crypto.createHash('sha256').update(token).digest('hex');\n}\n\napp.post('/api/login', async (req, res) => {\n  const user = await User.findOne({ email: req.body.email });\n  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {\n    return res.status(401).json({ error: 'Invalid credentials' });\n  }\n  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });\n  const refreshToken = crypto.randomBytes(40).toString('hex');\n  user.refreshToken = hashToken(refreshToken);\n  await user.save();\n  res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });\n  res.json({ accessToken });\n});\n\napp.post('/api/refresh', async (req, res) => {\n  const token = req.cookies.refreshToken;\n  if (!token) return res.status(401).json({ error: 'No refresh token' });\n  const hashed = hashToken(token);\n  const user = await User.findOne({ refreshToken: hashed });\n  if (!user) return res.status(403).json({ error: 'Invalid refresh token' });\n  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });\n  const newRefresh = crypto.randomBytes(40).toString('hex');\n  user.refreshToken = hashToken(newRefresh);\n  await user.save();\n  res.cookie('refreshToken', newRefresh, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });\n  res.json({ accessToken });\n});`,
    starterCode: `// TODO: Import jwt, bcrypt, crypto
// TODO: Write a hashToken(token) helper using crypto.createHash('sha256')

// POST /api/login
// TODO: Find user by email and verify password with bcrypt.compare
// TODO: Sign a short-lived access token (15 min) with jwt.sign
// TODO: Generate a random refresh token, hash it, save on user doc
// TODO: Set refresh token as httpOnly cookie; return access token in JSON

// POST /api/refresh
// TODO: Read refresh token from req.cookies
// TODO: Hash it and find user with matching refreshToken
// TODO: Issue new access + refresh token pair (rotation)
// TODO: Update stored hash and cookie
`,
    tags: ["express", "security", "jwt"],
    hints: ["Hash refresh token before storing; on refresh, issue new pair and update hash (rotation)."],
  },
  {
    order: 12,
    title: "Server-side filtering with multiple conditions",
    prompt:
`Build a GET /api/tasks/search endpoint that filters by:
  • title — partial match (regex, case-insensitive).
  • status — can be an array (e.g. ?status=todo&status=done).
  • fromDate / toDate — date range on the createdAt field.

All filters are optional. Return matching tasks sorted by createdAt desc.

Write the full route with dynamic query building.`,
    type: "codeSnippet",
    correctAnswer: `app.get('/api/tasks/search', async (req, res) => {\n  const { title, status, fromDate, toDate } = req.query;\n  const filter = {};\n  if (title) filter.title = { $regex: title, $options: 'i' };\n  if (status) {\n    const arr = Array.isArray(status) ? status : [status];\n    filter.status = { $in: arr };\n  }\n  if (fromDate || toDate) {\n    filter.createdAt = {};\n    if (fromDate) filter.createdAt.$gte = new Date(fromDate);\n    if (toDate) filter.createdAt.$lte = new Date(toDate);\n  }\n  const tasks = await Task.find(filter).sort({ createdAt: -1 });\n  res.json(tasks);\n});`,
    starterCode: `// TODO: Define GET '/api/tasks/search' route with async handler
// TODO: Destructure title, status, fromDate, toDate from req.query
// TODO: Build filter object:
//   - If title: add $regex with $options: 'i'
//   - If status: normalize to array, use $in
//   - If fromDate/toDate: add $gte/$lte on createdAt
// TODO: Find tasks with filter, sort by createdAt desc
// TODO: Return the results as JSON
`,
    tags: ["express", "mongoose"],
    hints: ["Build filter object conditionally; $regex for text; $in for array; $gte/$lte for dates."],
  },
  {
    order: 13,
    title: "Code splitting + lazy loading in React Router",
    prompt:
`Set up React Router with lazy-loaded routes:
  1. Lazy-import Dashboard from './pages/Dashboard'.
  2. Lazy-import Profile from './pages/Profile'.
  3. Wrap routes in Suspense with a <div>Loading...</div> fallback.
  4. Define routes: '/' → Dashboard, '/profile' → Profile.

Export the App component as default.`,
    type: "codeSnippet",
    correctAnswer: `import React, { Suspense } from 'react';\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\n\nconst Dashboard = React.lazy(() => import('./pages/Dashboard'));\nconst Profile = React.lazy(() => import('./pages/Profile'));\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <Suspense fallback={<div>Loading...</div>}>\n        <Routes>\n          <Route path=\"/\" element={<Dashboard />} />\n          <Route path=\"/profile\" element={<Profile />} />\n        </Routes>\n      </Suspense>\n    </BrowserRouter>\n  );\n}`,
    starterCode: `// TODO: Import React, Suspense, and routing components from 'react-router-dom'
// TODO: Use React.lazy() to dynamically import Dashboard and Profile
// TODO: Export default function App
// TODO: Wrap Routes inside BrowserRouter and Suspense (with Loading... fallback)
// TODO: Define Route for '/' (Dashboard) and '/profile' (Profile)
`,
    tags: ["react", "react-router", "performance"],
    hints: ["React.lazy(() => import('...')); wrap Routes in Suspense."],
  },
  {
    order: 14,
    title: "Security hardening",
    prompt:
`Harden an Express application by adding:
  1. Helmet middleware (default settings).
  2. CORS restricted to a specific origin ('https://myapp.com'), credentials allowed.
  3. Input sanitization: a middleware that recursively strips keys starting with '$' from req.body to prevent NoSQL injection.
  4. Request size limit: express.json with a 10kb limit.

Write all four as middleware registrations.`,
    type: "codeSnippet",
    correctAnswer: `const helmet = require('helmet');\nconst cors = require('cors');\n\napp.use(helmet());\napp.use(cors({ origin: 'https://myapp.com', credentials: true }));\napp.use(express.json({ limit: '10kb' }));\n\nfunction sanitize(obj) {\n  for (const key in obj) {\n    if (key.startsWith('$')) {\n      delete obj[key];\n    } else if (typeof obj[key] === 'object' && obj[key] !== null) {\n      sanitize(obj[key]);\n    }\n  }\n}\n\napp.use((req, res, next) => {\n  if (req.body) sanitize(req.body);\n  next();\n});`,
    starterCode: `// TODO: Import/require helmet and cors
// TODO: Apply helmet() middleware
// TODO: Apply cors() restricted to 'https://myapp.com' with credentials: true
// TODO: Apply express.json() with a 10kb limit
// TODO: Write a recursive sanitize(obj) function that deletes keys starting with '$'
// TODO: Apply a middleware that sanitizes req.body before proceeding
`,
    tags: ["express", "security"],
    hints: ["helmet(), cors({ origin, credentials }), express.json({ limit }), recursive key stripping."],
  },
  {
    order: 15,
    title: "Full optimistic + pessimistic update pattern",
    prompt:
`Implement a complete optimistic + pessimistic update for editing a task title using TanStack Query.

Write a custom hook useUpdateTask that:
  1. Uses useMutation to PATCH /api/tasks/:id with { title }.
  2. onMutate: cancel queries, snapshot, optimistically update the task in the ['tasks'] cache.
  3. onError: roll back to snapshot.
  4. onSettled: invalidate ['tasks'] to refetch fresh data (pessimistic reconciliation).
  5. On success (onSuccess): optionally show a toast/log.

Return the mutation object. Export as named export.`,
    type: "codeSnippet",
    correctAnswer: `import { useMutation, useQueryClient } from '@tanstack/react-query';\n\nexport function useUpdateTask() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: ({ id, title }) =>\n      fetch(\`/api/tasks/\${id}\`, {\n        method: 'PATCH',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ title }),\n      }).then(r => r.json()),\n    onMutate: async ({ id, title }) => {\n      await queryClient.cancelQueries({ queryKey: ['tasks'] });\n      const previous = queryClient.getQueryData(['tasks']);\n      queryClient.setQueryData(['tasks'], old =>\n        old.map(t => t._id === id ? { ...t, title } : t)\n      );\n      return { previous };\n    },\n    onError: (err, vars, context) => {\n      queryClient.setQueryData(['tasks'], context.previous);\n    },\n    onSuccess: () => {\n      console.log('Task updated successfully');\n    },\n    onSettled: () => {\n      queryClient.invalidateQueries({ queryKey: ['tasks'] });\n    },\n  });\n}`,
    starterCode: `// TODO: Import useMutation and useQueryClient from '@tanstack/react-query'
// TODO: Export function useUpdateTask
// TODO: Get queryClient via useQueryClient()
// TODO: Return useMutation with:
//   - mutationFn: PATCH '/api/tasks/:id' with { title }
//   - onMutate: cancel queries, snapshot cache, optimistically update matching task
//   - onError: rollback using context.previous
//   - onSuccess: log success message
//   - onSettled: invalidate ['tasks'] for pessimistic reconciliation
`,
    tags: ["react", "react-query"],
    hints: ["onMutate: snapshot + optimistic; onError: rollback; onSettled: invalidate for reconciliation."],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Seed
// ═══════════════════════════════════════════════════════════════════════════

async function seed() {
  await mongoose.connect(uri);
  await Problem.deleteMany({});
  const docs = [
    ...level1.map((p) => ({ ...p, level: 1 })),
    ...level2.map((p) => ({ ...p, level: 2 })),
    ...level3.map((p) => ({ ...p, level: 3 })),
  ];
  await Problem.insertMany(docs);
  console.log(`Inserted ${docs.length} problems (${level1.length} + ${level2.length} + ${level3.length}).`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
