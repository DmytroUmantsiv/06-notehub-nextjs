'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/types/responses';

import css from './NotesPage.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    placeholderData: () => queryClient.getQueryData<FetchNotesResponse>(['notes', page, debouncedSearch]),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage message={error?.message} />}

      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>Create Note +</button>
      </header>

      {!isLoading && !isFetching && notes.length === 0 && (
        <p className={css.noNotesMessage}>No notes found</p>
      )}
      {notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && (
        <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
