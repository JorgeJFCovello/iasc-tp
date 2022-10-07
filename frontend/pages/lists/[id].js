import styles from '../../styles/Home.module.css';
import ListDetailPanel from '../../components/ListDetailPanel.js';
import { useRouter } from 'next/router';

export default function ListDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  console.log('id: ', id);
  return <ListDetailPanel listName={id} />;
}
