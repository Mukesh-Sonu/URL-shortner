import useFetch from '@/hooks/use-fetch';
import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { getUrls } from '@/db/apiUrls';
import { UrlState } from '@/context';
import { getClicksForUrls } from '@/db/apiClicks';
import Error from '@/components/ui/error';
import LinkCard from '@/components/link-card';
import CreateLink from '@/components/create-link';

const Dashboard = () => {
  const { user } = UrlState();
  const {
    data: urls,
    loading: loadingUrls,
    error: errorUrls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);
  const {
    data: clicks,
    loading: loadingClicks,
    error: errorClicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingUrls || loadingClicks) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }

  if (errorUrls || errorClicks) {
    const message = errorUrls?.message || errorClicks?.message;
    return <Error message={message} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>

      {(filteredUrls || []).map((url) => (
        <LinkCard key={url.id} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  );
};

export default Dashboard;
