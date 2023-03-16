import Head from 'next/head'
import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import { trpc } from '@/utils/trpc'

import { 
  Card,
  CardContent,
  CardForm,
  CardHeader,
  List,
  ListItem,
} from '@/components'
import { GroceryList } from '@prisma/client'

const Home: NextPage = () => {
  const [itemName, setItemName] = useState<string>('');

  const { data: list, refetch} = trpc.findAll.useQuery();
  const insertMutation = trpc.insertOne.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteAllMutation = trpc.deleteAll.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateOneMutation = trpc.updateOne.useMutation({
    onSuccess: () => {
      refetch();
    },
  });


  const insertOne = useCallback(() => {
    if (itemName === '') return;

    insertMutation.mutate({
      title: itemName,
    });
    setItemName('');
  }, [itemName, insertMutation]);

  const clearAll = useCallback(() => {
    if (list?.length) {
      deleteAllMutation.mutate({
        ids: list.map((item) => item.id),
      });
    }
  }, [deleteAllMutation, list]);

  const updateOne = useCallback(
    (item: GroceryList) => {
      updateOneMutation.mutate({
        ...item,
        checked: !item.checked,
      });
    },
    [updateOneMutation]
  );

  return (
    <>
      <Head>
        <title>Grocery List</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          <CardContent>
            <CardHeader
              title="Grocery List"
              listLength={list?.length ?? 0}
              clearAllFn={clearAll}
            />
            <List>
              {list?.map((item) => (
                <ListItem key={item.id} item={item} onUpdate={updateOne} />
              ))}
            </List>
          </CardContent>
          <CardForm
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            submit={insertOne}
          />
        </Card>
      </main>
    </>
  )
}

export default Home;
