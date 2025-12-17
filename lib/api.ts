import axios from 'axios';
import {Note} from '@/types/note';
import type {FetchNotesResponse} from '@/types/responses';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
});




export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
} = {}): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await api.get('/notes', { params });

  const rawNotes = data.notes; 
  if (!Array.isArray(rawNotes)) {
    console.error('API returned invalid notes:', data);
    return { notes: [], totalPages: 1, page };
  }

  const notes: Note[] = rawNotes.map((note: any) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    tag: note.tag,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }));

  return {
    notes,
    totalPages: data.totalPages,
    page,
  };
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get(`/notes/${id}`);

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    tag: data.tag,
    createdAt: data.created_at,
    updatedAt: data.updated_at || data.created_at,
  };
}

export async function createNote(payload: {
  title: string;
  content?: string;
  tag: Note['tag'];
}): Promise<Note> {
  const { data } = await api.post('/notes', payload);

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    tag: data.tag,
    createdAt: data.created_at,
    updatedAt: data.updated_at || data.created_at,
  };
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete(`/notes/${id}`);

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    tag: data.tag,
    createdAt: data.created_at,
    updatedAt: data.updated_at || data.created_at,
  };
}
