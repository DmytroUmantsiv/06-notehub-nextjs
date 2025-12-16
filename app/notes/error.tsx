'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function NotesError({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
