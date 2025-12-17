import { useState } from "react";
import {
  createCar,
  createRentalOffer,
} from "../requests/offerRegistration-api";


export default function OfferRegistration() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  return (
    <div className="mt-6 px-10 sm:px-12 lg:px-16 space-y-10">
      <div className="max-w-[572px] mx-auto space-y-10">
        {/* ================= 차량 이미지 영역 ================= */}
        <div className="border border-stone-200 rounded-lg bg-stone-50 p-5">
          {images.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-stone-400 text-sm">
              차량 이미지를 등록해주세요 (최대 여러 장 가능)
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-52 w-80 object-cover rounded-md border border-stone-200"
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= 차량 타이틀 ================= */}
        <div className="px-1">
          <h1 className="text-xl font-bold">차량 등록</h1>
          <p className="text-sm text-stone-500">
            렌트카 정보를 입력하고 이미지를 등록하세요
          </p>
        </div>

        {/* ================= STEP 탭 ================= */}
        <div className="flex gap-6 border-b border-stone-200 pb-3 text-sm font-medium px-1">
          <span className={step === 1 ? "text-cyan-600" : "text-stone-400"}>
            예약 정보
          </span>
          <span className={step === 2 ? "text-cyan-600" : "text-stone-400"}>
            차량 상세
          </span>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-5">
            <Input label="차량명" placeholder="K3 2세대 F/L" />
            <Input label="차종" placeholder="준중형" />
            <Input label="제조사" placeholder="기아" />
            <Input label="연식" type="number" placeholder="2024" />
            <Input label="좌석 수" type="number" placeholder="5" />
            <Input label="변속기" placeholder="오토" />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <Input
              label="하루 렌트 가격 (원)"
              type="number"
              placeholder="150,000"
            />

            {/* 차량 옵션 */}
            <div>
              <label className="block text-sm font-medium mb-1 text-stone-700">
                차량 옵션
              </label>
              <textarea
                rows={3}
                placeholder="USB, 블루투스, 네비게이션, 후방카메라, 스마트키..."
                className="w-full rounded-md border border-stone-200 p-3 text-sm
                           focus:outline-none focus:ring-1 focus:ring-stone-300"
              />
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-stone-700">
                차량 이미지 등록
              </label>
              <label
                className="block cursor-pointer border-2 border-dashed border-stone-200 rounded-md p-6
                           text-center text-stone-500 hover:bg-stone-50"
              >
                이미지 파일 선택
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200"
              >
                이전
              </button>
              <button className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                등록 완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-stone-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-10 rounded-md border border-stone-200 bg-white px-3 text-sm
                   text-stone-800 placeholder:text-stone-400
                   focus:outline-none focus:ring-1 focus:ring-stone-300"
      />
    </div>
  );
}
