import { getLongUrl } from '@/db/apiUrls';
import { storeClicks } from '@/db/apiClicks';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width="100%" color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return <div>redirect-link</div>;
};

export default RedirectLink;
