import { useEffect, useState, useContext } from 'react';
import type Realm from 'realm';

import { realmDBContext } from './context';

export function useRealm(): Realm {
  const ctx = useContext(realmDBContext);

  if (!ctx || !ctx.current) {
    throw new Error('useRealm hook must be used inside RealmProvider context');
  }

  return ctx.current;
}

export type RealmResultsFn<T> = (realm: Realm) => Realm.Results<T>;

export function useRealmResults<T = unknown>(queryFn: RealmResultsFn<T>) {
  const realm = useRealm();

  // The results will be set once the realm has opened and the collection has been queried.
  const [results, setResults] = useState<Realm.Results<T>>();

  useEffect(() => {
    // When querying a realm to find objects (e.g. realm.objects('Tasks')) the result we get back
    // and the objects in it are "live" and will always reflect the latest state.
    const queryResults = queryFn(realm);
    if (queryResults?.length) {
      setResults(queryResults);
    }

    // Live queries and objects emit notifications when something has changed that we can listen for.
    queryResults.addListener((/*collection, changes*/) => {
      // If wanting to handle deletions, insertions, and modifications differently you can access them through
      // the two arguments. (Always handle them in the following order: deletions, insertions, modifications)
      // If using collection listener (1st arg is the collection):
      // e.g. changes.insertions.forEach((index) => console.log('Inserted item: ', collection[index]));
      // If using object listener (1st arg is the object):
      // e.g. changes.changedProperties.forEach((prop) => console.log(`${prop} changed to ${object[prop]}`));

      // By querying the objects again, we get a new reference to the Result and triggers
      // a rerender by React. Setting the tasks to either 'tasks' or 'collection' (from the
      // argument) will not trigger a rerender since it is the same reference
      setResults(queryFn(realm));
    });

    return () => {
      queryResults?.removeAllListeners();

      setResults(undefined);
    };
  }, [queryFn, realm]);

  return results;
}
