import { IoImageOutline, IoClose } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { Web3Storage } from 'web3.storage';
import { PollUpdateState } from '../../recoil/update-poll/UpdatePolls';

const api: string | undefined =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZhM0MwODkyQTYwQTU5YTFBMjcxNjNkZTA1YTVDOTM3ZWYwOTY5QmIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAyMDQyNjY1MjIsIm5hbWUiOiJhcHAtdm90ZSJ9.G-VpGTOY2xArszscH8dz9oLBQvWAj8KbnUMeHVSN-kI';
const client = new Web3Storage({ token: api, endpoint: new URL('https://api.web3.storage') });
const Description: React.FC = () => {
  const refInput = useRef<HTMLInputElement>(null);
  const refText = useRef<HTMLTextAreaElement>(null);
  const [pollNeedUpdate, setPollNeedUpdate] = useRecoilState(PollUpdateState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Lưu link ảnh
  async function handleChangeImg(e: any) {
    const file = e.target.files[0];
    setIsLoading(true);
    if (file) {
      try {
        const added = await client.put([file]);
        const url = `https://${added}.ipfs.dweb.link/${file.name}`;
        setPollNeedUpdate({ ...pollNeedUpdate, img_url: url });
        setIsLoading(false);
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }

  return (
    <div>
      {/* Title input */}
      <input
        ref={refInput}
        placeholder="The vote title"
        className="h-10 w-full bg-primary-20 rounded-lg py-2 px-6 outline-none border-[2px] border-transparent focus:border-[2px] focus:border-white"
        onChange={() => {
          setPollNeedUpdate({ ...pollNeedUpdate, title: refInput.current?.value ? refInput.current?.value : '' });
        }}
        value={pollNeedUpdate.title}
      />
      {/* Upload file input */}
      {isLoading === true ? (
        <div className="w-full h-[94px] flex justify-center items-center">
          <ReactLoading type="bubbles" color="#eee" height={'20%'} width={50} />
        </div>
      ) : (
        <>
          <div
            className={`w-full h-[280px] mt-11 border-[1px] border-primary-80 border-dashed rounded-2xl relative ${
              pollNeedUpdate.img_url ? 'invisible' : ''
            }`}
          >
            <label className="h-full flex justify-center items-center flex-col opacity-80">
              <IoImageOutline className="w-10 h-10" />
              Add a cover
            </label>
            <input
              type="file"
              className="w-full h-full opacity-0 absolute top-0 outline-none z-100 cursor-pointer"
              onChange={handleChangeImg}
            />
          </div>
        </>
      )}

      {pollNeedUpdate.img_url && (
        <div className="mt-[60px] absolute top-14  rounded-xl overflow-hidden bg-primary">
          <img
            alt="Img Update"
            src={pollNeedUpdate.img_url}
            title="Description image"
            className="w-[366px] h-[280px] z-100 object-covero bject-fill"
          />
          <div className="absolute text-white top-1 right-1 z-100 p-1 bg-[#333] rounded-3xl cursor-pointer hover:bg-[#94acb7]">
            <IoClose
              className=""
              onClick={() => {
                setPollNeedUpdate({ ...pollNeedUpdate, img_url: null });
              }}
            />
          </div>
        </div>
      )}
      <textarea
        placeholder="Write a vote description"
        className="w-full  mt-8 h-32 bg-primary-10 outline-none rounded-lg p-2 overflow-y-auto border-[2px] border-transparent focus:border-[2px] focus:border-white"
        onChange={(e) => {
          setPollNeedUpdate({ ...pollNeedUpdate, description: e.target?.value ? e.target?.value : '' });
        }}
        value={pollNeedUpdate.description}
      />
    </div>
  );
};

export default Description;
