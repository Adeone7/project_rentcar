import { useRef, useState } from "react";
import { carsByQuery } from "../requests/account-api";

function CarSelector({ onCarSelected }) {
  const [searchTern, setSearchTern] = useState("");
  const [carList, setCarList] = useState([]);
  const [selectedCarIdx, setSelectedCarIdx] = useState(null);
  const [selectedCarInfo, setSelectedCarInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchDebounceTimer = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const triggerCarSearch = async (query) => {
    if (!query.trim()) {
      setCarList([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await carsByQuery(query);

      if (result.success) {
        setCarList(result.carList);
        setShowDropdown(false);
      } else {
        console.error("자동차 검색 실패: ", result.message);
        setCarList([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("API 호출중 오류 발생: ", error);
      setCarList([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setShowDropdown(true);

    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      triggerCarSearch(query);
    }, 300);

    const handleCarSelect = (car) => {
      setSelectedCarIdx(car.idx);
      setSelectedCarInfo(car);
      setSearchTerm(
        `${car.corporation} ${car.modelName} ${car.modelYear} ${car.carType}`
      );
      setCarList([]);
      setShowDropdown(false);
      console.log(`선택된 자동차 idx: ${car.idx}`);

      if (onCarSelected) {
        onCarSelected(car.idx);
      }
    };

    // 입력창 포커스 / 블러처리
    const handleInputFocus = () => {
      if (searchTerm && carList.length > 0) {
        setShowDropdown(true);
      } else if (searchTerm && !isLoading) {
        triggerCarSearch(searchTerm);
      }
    };

    const handleInputBlur = (e) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(e.relatedTarget)
      ) {
        return;
      }

      setTimeout(() => {
        setShowDropdown(false);
      }, 100);
    };

    return (
      <div
        style={{ position: "relative", width: "300px", margin: "20px auto" }}
      >
        {" "}
        {/* relative로 설정해서 자식 요소 absolute 위치 잡기 */}
        <h3>자동차 선택하기</h3>
        <input
          ref={inputRef} // ref 연결
          type="text"
          placeholder="차량 모델명, 제조사 등 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box", // 패딩이 너비를 초과하지 않게
          }}
          disabled={isLoading} // 로딩 중에는 입력 비활성화 (선택 사항)
        />
        {/* 드롭다운 검색 결과 리스트 */}
        {showDropdown &&
          (carList.length > 0 || isLoading) && ( // 로딩 중이거나 결과가 있을 때만 드롭다운 표시
            <ul
              ref={dropdownRef} // ref 연결
              tabIndex="-1" // 포커스 가능하게 하여 blur 이벤트에 관련 타겟으로 잡히게 함
              style={{
                position: "absolute", // 입력창 밑에 띄우기
                top: "100%", // 입력창 높이만큼 아래에 위치
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                maxHeight: "200px",
                overflowY: "auto",
                listStyle: "none",
                padding: 0,
                margin: "5px 0 0 0", // 위쪽 여백 조금
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                zIndex: 100, // 다른 요소 위에 오도록 z-index 높게
              }}
            >
              {isLoading &&
                carList.length === 0 && ( // 로딩 중이고 아직 결과가 없으면
                  <li
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    검색 중...
                  </li>
                )}
              {!isLoading &&
                carList.length === 0 &&
                searchTerm && ( // 검색어는 있지만 결과가 없을 때
                  <li
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    검색 결과 없음
                  </li>
                )}
              {carList.map((car) => (
                <li
                  key={car.idx}
                  onClick={() => handleCarSelect(car)}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    whiteSpace: "nowrap", // 텍스트 한 줄로
                    overflow: "hidden", // 넘치면 숨김
                    textOverflow: "ellipsis", // 넘치면 ...으로 표시
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f0f0f0")
                  } // 호버 효과
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  {car.corporation} - {car.modelName} ({car.modelYear},{" "}
                  {car.carType})
                </li>
              ))}
            </ul>
          )}
        {/* 선택된 자동차 정보 표시 (입력창 밑, 드롭다운 아님) */}
        {selectedCarInfo && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #007bff",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>선택된 차량:</strong>
            </p>
            <p>
              {selectedCarInfo.corporation} {selectedCarInfo.modelName} (
              {selectedCarInfo.modelYear})
            </p>
            <p>선택된 CarIdx: {selectedCarInfo.idx}</p>
            {/* 여기서는 선택된 carIdx를 보여주는 것만 하고, 최종적인 제출은 부모 컴포넌트에서 담당 */}
          </div>
        )}
      </div>
    );
  };
}
