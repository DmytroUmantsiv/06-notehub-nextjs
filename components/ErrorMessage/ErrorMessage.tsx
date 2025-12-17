import css from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className={css.error}>{message ?? 'Something went wrong'}</p>;
}
