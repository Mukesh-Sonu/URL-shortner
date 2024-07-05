import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { BarLoader } from 'react-spinners';
import { Copy, Download, Trash } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { deleteUrl } from '@/db/apiUrls';
import Error from '@/components/ui/error';

const LinkCard = ({ url, fetchUrls }) => {
  const {
    error: errorDelete,
    loading: loadingDelete,
    fn: fnDeleteUrl,
  } = useFetch(deleteUrl, url.id);

  if (loadingDelete) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }

  if (errorDelete) {
    const message = errorDelete?.message;
    return <Error message={message} />;
  }

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

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        className="object-contain h-32 ring ring-blue-500 self-start"
        alt="qr code"
      />

      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          https://trimrr.in/{url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://trimrr.in/${url?.short_url}`
            );
          }}
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDeleteUrl().then(() => fetchUrls())}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
