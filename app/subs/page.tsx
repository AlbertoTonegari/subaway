export default async function Subs() {
  let theme = "light";
  const request = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const response = await request.json();
  if (!response.completed) {
    theme = "dark";
  }

  return (
    <main>
      {theme === "dark" ? (
        <button className="bg-purple-800">Button</button>
      ) : (
        <button className="bg-yellow-400">Button</button>
      )}
    </main>
  );
}
