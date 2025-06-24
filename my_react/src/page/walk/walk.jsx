import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  usePetWalkLoadQuery,
  usePetImgLoadQuery,
  usePetCurrentWalkLoadQuery,
} from "../../features/pet/petWalkApi";
import { Button, Box } from "@mui/material";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import runningDog from "../../image/runningDog.png";
import back from "../../image/back.png";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const Main = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [walkId, setWalkId] = useState();
  const animalId = searchParams.get("animalId"); // 동물아이디 animalId parm에 저장
  const {
    data: IdResult,
    refetch: refetch2,
    isLoading: isLoading2,
  } = usePetWalkLoadQuery({
    animalId: animalId, // < 동물 아이디로 가장 최근 산책아이디 조회해올거임
  });
  const [images, setImages] = useState([]);
  const {
    data: imgResult,
    refetch,
    isLoading,
  } = usePetImgLoadQuery(
    {
      postFileKey: walkId, // 가장최근 산책아이디
      postFileCategory: "WAL",
    },
    { skip: !walkId }
  );

  const [walkInfoview, setWalkInfoview] = useState();
  const {
    data: walkInfo,
    refetch: currentWalk,
    isLoading: iscurrentLoading,
  } = usePetCurrentWalkLoadQuery(
    {
      walkId: walkId, // 가장최근 산책아이디
    },
    { skip: !walkId }
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("IdResult", IdResult);
    if (
      IdResult != null &&
      IdResult != undefined &&
      IdResult?.[0]?.walkId != null &&
      IdResult?.[0]?.walkId != undefined
    ) {
      const newWalkId = IdResult[0].walkId;
      console.log("11111111111  :" + newWalkId);
      setWalkId(newWalkId);
    }
  }, [IdResult]);

  useEffect(() => {
    const fetchCurrentWalk = async () => {
      if (walkId != null) {
        const result = await currentWalk();
        console.log("fetchCurrentWalk 결과:", result?.data);
        if (result?.data && result.data.length > 0) {
          setWalkInfoview(result.data);
        }
      }
    };
    fetchCurrentWalk();
  }, [walkId]);

  useEffect(() => {
    refetch2();
  }, []);

  useEffect(() => {
    setImages(imgResult || []);
  }, [imgResult]);

  const formatDate = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0부터 시작하니 +1
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12; // 12시 표시 처리

    return `${year}.${month}.${day}  ${ampm} ${hours
      .toString()
      .padStart(2, "0")}:${minutes}`;
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: "0",
      }}
    >
      <Button
        onClick={() => navigate(-1)}
        sx={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "10px",
          height: "35px",
          minWidth: "0",
          width: "35px",
          marginLeft: "30px",
          marginTop: "25px",
          position: "absolute",
          marginBottom: "20px",
          zIndex: 9999,
          "&:hover": {
            backgroundColor: "#363636",
          },
          backgroundColor: "rgba(54, 54, 54, 0.4)",
        }}
      >
        <img src={back} alt="" sx={{ pl: "2px" }}></img>
      </Button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          // padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        {/* 상단 대표 이미지 및 버튼 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            // maxWidth: "448px",
            height: "240px",
            // borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "1.5rem",
            backgroundImage: `url(${runningDog})`,
            backgroundSize: "cover", // 이미지를 요소에 맞게 자르기
            backgroundPosition: "center", // 가운데 정렬
            backgroundRepeat: "no-repeat", // 반복 금지
          }}
        >
          <button
            onClick={() => navigate("/pet/walkRecord.do?animalId=" + animalId)}
            // 동물아이디   사진찍을때쓸 다음 워크아이디저장
            style={{
              position:"absolute",
              right: "20px",
              bottom: "1rem",
              backgroundColor: "#ca8a04",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: "bold",
              borderRadius: "9999px",
              width: "6rem",
              height: "6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              lineHeight: "1.25rem",
              zIndex: 9999,
            }}
          >
            RUN
            <br />
            START
          </button>
        </div>

        {/* 최근 기록 표시 */}
        <div
          style={{ width: "100%", textAlign: "center", marginBottom: "2rem" }}
        >
          <p style={{ color: "#4b5563" }}>최근 기록</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "0.5rem",
            }}
          >
            <div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                시작 시간
              </p>
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                  padding: "0.5rem 1rem",
                  marginTop: "0.25rem",
                }}
              >
                {walkInfoview ? ( <div>{formatDate(walkInfoview[0].walkDt)}</div> ) :
                 (<div style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                }}>기록이 없습니다.</div>)}
              </div>
            </div>

            <div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                소요 시간
              </p>
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                  padding: "0.5rem 1rem",
                  marginTop: "0.25rem",
                }}
              >
                {walkInfoview ? ( <div>{walkInfoview[0].walkTime} </div> ) :
                 (<div style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                }}>기록이 없습니다.</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 갤러리 */}
        <div style={{ width: "100%", textAlign: "center" }}>
          <p style={{ color: "#4b5563", marginRight: "270px" }}>
            최근 산책 풍경
          </p>
          <div style={{ width: "92%", maxWidth: "448px", padding:"0px 15px"}}>
            {isLoading ? (
              <div>이미지 로딩 중...</div>
            ) : !images || images.length === 0 ? (
              <div
                style={{ textAlign: "center", color: "#999", fontSize: "1rem" }}
              >
                이미지가 없습니다.
              </div>
            ) : images.length <= 8 ? (
              <div
                style={{
                  width:"100%",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: "0 0 23%",
                      borderRadius: 8,
                      overflow: "hidden",
                      marginBottom:10,
                    }}
                  >
                    <img
                      src={`http://192.168.0.30:8081${image.postFilePath.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={`img-${idx}`}
                      onClick={() => handleImageClick(image)}
                      style={{
                        width: "100%",
                        height: "6rem",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
              >
                {chunkArray(images, 8).map((group, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {group.map((image, i) => (
                        <div
                          key={i}
                          style={{
                            flex: "0 0 23%",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={`http://192.168.0.32:8081${image.postFilePath.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt={`img-${i}`}
                            onClick={() => handleImageClick(image)}
                            style={{
                              width: "100%",
                              height: "6rem",
                              objectFit: "cover",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {isModalOpen && selectedImage && (
          <div
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              transform: "scale(1.7)",
            }}
          >
            <img
              src={`http://192.168.0.30:8081${selectedImage.postFilePath.replace(
                /\\/g,
                "/"
              )}`}
              alt="확대 이미지"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: 12,
              }}
            />
          </div>
        )}
      </div>
    </Box>
  );
};

export default Main;
