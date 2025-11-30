'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import Loader from '@/components/Loader/Loader';
import css from '@app/notes/NoteDetails.module.css';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, error } = useQuery<Note, Error>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Loader />;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
