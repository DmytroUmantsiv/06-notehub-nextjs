'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/types/note';

import css from './Notes.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  
  const { data, isLoading, isError, isFetching } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),

   
    placeholderData: (prev) => prev ?? undefined,

    staleTime: 60000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      <header className={css.toolbar}>
        <button onClick={() => setModalOpen(true)}>Create note +</button>
      </header>

      <NoteList notes={notes} />

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          {}
          <NoteForm onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
