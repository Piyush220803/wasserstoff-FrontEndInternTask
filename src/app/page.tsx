import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/editor');
  return null; // redirect will handle this, but good practice to return null or a loader
}
