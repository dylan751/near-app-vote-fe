import { IoImageOutline, IoClose } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { Web3Storage } from 'web3.storage';
import ReactLoading from 'react-loading';
import { Poll } from '../../recoil/create-poll/PollsState';

const api: string | undefined = process.env.REACT_APP_API_TOKEN!;
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZhM0MwODkyQTYwQTU5YTFBMjcxNjNkZTA1YTVDOTM3ZWYwOTY5QmIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAyMDQyNjY1MjIsIm5hbWUiOiJhcHAtdm90ZSJ9.G-VpGTOY2xArszscH8dz9oLBQvWAj8KbnUMeHVSN-kI';
const client = new Web3Storage({ token: api, endpoint: new URL('https://api.web3.storage') });

const Description: React.FC = () => {
  const [poll, setPoll] = useRecoilState(Poll);
  const [linkImage, setLinkImage] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Lưu link ảnh
  async function handleChangeImg(e: any) {
    setIsLoading(true);
    try {
      const file = e.target.files[0];
      setIsLoading(true);
      const added = await client.put([file]);
      const url = `https://${added}.ipfs.dweb.link/${file.name}`;
      setLinkImage(url);
      setIsLoading(false);
    } catch (error) {
      console.log('Error uploading file: ', error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (linkImage) setPoll({ ...poll, img_url: linkImage });
  }, [linkImage]);
  return (
    <div>
      {/* Title input */}
      <input
        placeholder="The vote title"
        className="h-10 w-full bg-primary-20 rounded-lg py-2 px-6 outline-none border-[2px] border-transparent focus:border-[2px] focus:border-white"
        onChange={(e) => {
          setPoll({ ...poll, title: e.target?.value ? e.target?.value : '' });
        }}
        value={poll.title}
      />
      {/* Upload file input */}
      <div
        className={`w-full h-[280px] mt-11 border-[1px] border-primary-80 border-dashed rounded-2xl relative ${
          poll.img_url || isLoading ? 'invisible' : ''
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
      {/* Show image */}
      {poll.img_url ? (
        <div className="mt-[60px] absolute top-14  rounded-xl overflow-hidden bg-primary">
          <img
            src={poll.img_url}
            title="Description image"
            className="w-[366px] h-[280px] z-100 object-cover object-fill"
          />
          <div className="absolute text-white top-1 right-1 z-100 p-1 bg-[#333] rounded-3xl cursor-pointer hover:bg-[#94acb7]">
            <IoClose
              className=""
              onClick={() => {
                setPoll({ ...poll, img_url: null });
                setLinkImage(null);
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          {isLoading && (
            <ReactLoading
              type="bubbles"
              color="#eee"
              height={'20%'}
              width={50}
              className="absolute top-1/3 left-1/2 -translate-x-1/2	"
            />
          )}
        </div>
      )}
      {/* Description */}
      <textarea
        placeholder="Write a vote description"
        className="w-full  mt-8 h-32 bg-primary-10 outline-none rounded-lg p-2 overflow-y-auto border-[2px] border-transparent focus:border-[2px] focus:border-white"
        onChange={(e) => {
          setPoll({ ...poll, description: e.target?.value ? e.target?.value : '' });
        }}
        value={poll.description}
      />
    </div>
  );
};

export default Description;
