// A mock function to mimic making an async request for data
export function save(data) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(data), 1000)
  );
}
