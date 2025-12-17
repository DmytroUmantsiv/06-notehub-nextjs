'use client';

import Link from 'next/link';
import css from './NoteList.module.css';
import type { Note } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';

interface NoteListProps {
  notes: Note[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export default function NoteList({ notes, isLoading = false, isFetching = false }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
    },
  });

  if (!isLoading && !isFetching && notes.length === 0) {
    return <p className={css.empty}>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <Link href={`/notes/${n.id}`} className={css.link}>
              View details
            </Link>
            <button
              className={css.button}
              onClick={() => mutation.mutate(n.id)}
              disabled={mutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
