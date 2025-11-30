'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import { Toaster, toast } from 'react-hot-toast';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

type FetchNotesResponse = Awaited<ReturnType<typeof fetchNotes>>;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

   
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

 
  const { data, isLoading, isFetching, isError, isSuccess } =
    useQuery<FetchNotesResponse, Error>({
      queryKey: ['notes', page, debouncedSearch],
      queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
      placeholderData: queryClient.getQueryData(['notes', page - 1, debouncedSearch]),
      staleTime: 60000,
      refetchOnWindowFocus: false,
    });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  
  useEffect(() => {
    if (isFetching && notes.length > 0) {
      toast.loading('Updating...', { id: 'fetch' });
    } else {
      toast.dismiss('fetch');
    }

    if (isSuccess && notes.length === 0 && debouncedSearch) {
      toast('No notes found for your request.');
    }
  }, [isFetching, isSuccess, notes.length, debouncedSearch]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {(isLoading || isFetching) && <Loader />}
        {isError && <ErrorMessage />}

        <NoteList notes={notes}/>

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}

        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm onCancel={() => setModalOpen(false)} />
          </Modal>
        )}
      </main>
    </div>
  );
}