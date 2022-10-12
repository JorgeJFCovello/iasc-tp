import styles from '../../styles/Home.module.css';
import ListPanel from '../../components/ListPanel.js';
import { Context } from '../../libs/context';
import { useContext } from 'react';

export default function ListPage() {
  const [context, setContext] = useContext(Context);
  //pasar esto con redux y fue
  const username = context?.username;
  return <ListPanel username={username} />;
}
