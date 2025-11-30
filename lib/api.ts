import axios from 'axios';
import type { Note } from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;


export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
}: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await axios.get(`${API_URL}/notes`, {
    params,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

   
  return data;
}


export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await axios.get(`${API_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
}


export async function createNote(payload: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> {
  const { data } = await axios.post(`${API_URL}/notes`, payload, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axios.delete(`${API_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
}
