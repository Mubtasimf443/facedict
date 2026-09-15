/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { TabsContent } from "@/components/shadcn/tabs";
import { toast } from "@/components/shadcn/toast";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  userId: number
}

export default function MediaTab({ userId }: IProps) {

  let [medias, setMedias] = useState<string[]>([]);
  let [loading, setLoading] = useState<boolean>(true);
  let [showModel, setShowModel] = useState<boolean>(false);
  let [modelImage, setModelImage] = useState<string>('');

  useEffect(() => {
    async function LoadMedia() {
      try {
        let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/post/media/' + userId, {
          cache: 'no-cache',
          credentials: 'include'
        });
        if (response.status === 200) {
          let { data } = await response.json();
          setMedias(data.images);
        } else {
          toast.add({ title: 'failed to load Medias' })
        }
      } catch (error) {
        console.error(error);
        toast.add({
          title: "couldn't load Image",
          description: "Because of an unknown server error, failed to load the Image"
        });
      } finally {
        setLoading(false);
      }
    }
    LoadMedia()
  }, [])
  return (
    <TabsContent value={'media'} className="w-full flex flex-col justify-start items-start mt-5">
      {loading && <Loader />}
      {!loading && medias.length === 0 && <p>No Media is Uploaded</p>}
      <div className="flex flex-row flex-wrap justify-start items-center gap-5">
        {medias.map((media, index) =>
          <Image
            key={index}
            loading={'eager'}
            src={media}
            alt="media"
            width={180}
            height={180}
            className=" shadow-lg object-center object-cover aspect-square"
            onClick={() => { setModelImage(media) ; setShowModel(true)}}
          />
        )}
      </div>

      <div className={`${showModel ? 'flex' : "hidden"} flex-row justify-center items-center h-dvh w-dvw fixed bg-black/20 top-0 left-0`}>
        <div 
        className={`w-100 h-100 relative bg-cover bg-center`}
        style={{backgroundImage : `url(${modelImage})`}}
        >
          <button
            type={'button'}
            className="text-xl text-white absolute top-5 right-5 cursor-pointer"
            onClick={() => setShowModel(false)}
          >&times;</button>
        </div>
      </div>
    </TabsContent>
  );
}
