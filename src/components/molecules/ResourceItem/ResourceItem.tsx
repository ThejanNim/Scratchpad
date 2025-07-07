import Link from "next/link";

export default function ResourceItem() {
  return (
    <div>
      <div>
        <Link href="#" className="w-[200px] flex">
          <div className="w-full max-w-full border border-[rgba(55,53,47,0.16)] rounded-[10px] select-none px-[14px] pt-3 pb-[14px]">
            <div className="text-sm font-[#32302c] whitespace-nowrap overflow-hidden text-ellipsis">Build Event-Driven Apps Locally with MongoDB Atlas Stream Processing | MongoDB Blog</div>
            <div className="text-xs font-[#73726e] overflow-hidden h-8 leading-4">Build complete event-driven applications locally with MongoDB Atlas Stream Processing.</div>
            <div>
                {/* <Image src="#" alt="resource item image" width="16" height="16" /> */}
                <div className="font-[#32302c] text-xs leading-4 whitespace-nowrap overflow-hidden text-ellipsis">https://www.mongodb.com/company/blog/innovation/build-event-driven-apps-locally-with-mongodb-atlas-stream-processing</div>
            </div>
          </div>
        </Link>
      </div>
      <div></div>
    </div>
  );
}
