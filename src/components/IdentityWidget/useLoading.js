// Type stuff commented out throughout these files. Could be re-created with React PropTypes
import React from 'react';

export default function useLoading() {
  const [isLoading, setIsLoading] = React.useState(false);
  const mount = React.useRef(false);
  React.useEffect(() => {
    mount.current = true
    return () => void (mount.current = false)
  }, []);
  function load/*<A>*/(aPromise) {   //: Promise<A>) {
    setIsLoading(true);
    return aPromise.finally(() => mount.current && setIsLoading(false));
  }
  return [isLoading, load];  // as [boolean, <A>(aPromise: Promise<A>) => Promise<A>];
}
