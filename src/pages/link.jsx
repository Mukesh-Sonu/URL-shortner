import { UrlState } from '@/context';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Copy, Download, Trash } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrl } from '@/db/apiUrls';
import { BarLoader } from 'react-spinners';
import { useEffect } from 'react';
import { LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LocationStats from '@/components/location-stats';
import DeviceStats from '@/components/device-stats';

const Link = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const naviagte = useNavigate();

  const {
    loading,
    data: url,
    error,
    fn,
  } = useFetch(getUrl, {
    id,
    user_id: user?.id,
  });
  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn(), fnStats();
  }, []);

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  if (error) {
    naviagte('/dashboard');
  }

  let link = '';
  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url;
  }

  if (loading || loadingStats) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 sm:flex-row justify-between">
      <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
        <span className="text-6xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <a
          href={`https://url-chunk.netlify.app/${link}`}
          target="_blank"
          className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
        >
          https://url-chunk.netlify.app/{link}
        </a>
        <a
          href={url?.original_url}
          target="_blank"
          className="flex items-center gap-1 hover:underline cursor-pointer"
        >
          <LinkIcon className="p-1" />
          <p className="break-all">{url?.original_url}</p>
        </a>
        <span className="flex items-end font-extralight text-sm">
          {new Date(url?.created_at).toLocaleString()}
        </span>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://url-chunk.netlify.app/${url?.short_url}`
              );
            }}
          >
            <Copy />
          </Button>
          <Button variant="ghost" onClick={downloadImage}>
            <Download />
          </Button>
          <Button variant="ghost" onClick={() => fnDelete()}>
            <Trash />
          </Button>
        </div>
        <img
          src={url?.qr}
          className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
          alt="qr code"
        />
      </div>

      <Card className="sm:w-3/5">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        {stats && stats?.length ? (
          <CardContent className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{stats?.length}</p>
              </CardContent>
            </Card>

            <CardTitle>Location Data</CardTitle>
            <LocationStats stats={stats} />
            <CardTitle>Device Info</CardTitle>
            <DeviceStats stats={stats} />
          </CardContent>
        ) : (
          <CardContent>
            <p>No Statics yet</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Link;
