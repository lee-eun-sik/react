import React, { useEffect, useState }  from 'react';
import { useImgSaveMutation } from '../../features/img/imgApi';
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useCmDialog } from '../../cm/CmDialogUtil';

const Camera = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imgSave] = useImgSaveMutation();
  const [images, setImages] = useState([]);
  const { showAlert } = useCmDialog();

  useEffect(() => {
    // Android에서 사진을 받는 함수 등록
    window.onCameraImageReceived = (base64Image) => {
      setImageSrc(base64Image);
      uploadImageToServer(base64Image);  // 서버로 업로드
    };

    fetchImageList(); // 초기 이미지 목록 로드

      // 컴포넌트 언마운트 시 함수 해제 (메모리 누수 방지)
    return () => {
      window.onCameraImageReceived = null;
    };

  }, []);

    // ✅ 이미지 목록을 서버에서 불러오는 함수
    const fetchImageList = () => {
      axios.get("http://192.168.0.32:8081/api/img/imgLoad.do")
        .then((res) => {
          console.log("이미지 리스트:", res.data);
          setImages(res.data);
        })
        .catch((err) => {
          console.error("이미지 목록 가져오기 실패", err);
        });
    };
    

  // 카메라 열기 함수
  const openCamera = () => {
    // 안드로이드 WebView의 JavaScript 인터페이스가 있을 경우에만 호출
    if (window.Android && typeof window.Android.openCamera === 'function') {
      window.Android.openCamera(); // 안드로이드 함수 호출
    } else {
      showAlert('Android 인터페이스를 사용할 수 없습니다.');
    }
  };

  // 서버로 Base64 이미지 업로드
  const uploadImageToServer = async (base64Image) => {
    try {
        // base64 → Blob
        const blob = base64ToBlob(base64Image);

        // Blob → File 객체로 변환 (선택 사항)
        const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('files', file); // 서버에서 "files"라는 key로 받을 것

        const result = await imgSave(formData).unwrap();
        console.log('이미지 업로드 성공:', result);

        // ✅ 업로드 성공 후 서버에서 이미지 목록 다시 가져오기
        fetchImageList();
      
      } catch (error) {
            console.error('이미지 업로드 실패:', error);
                if (error.data) {
                console.error('서버 응답:', error.data);
                }
            showAlert('이미지 업로드 중 오류가 발생했습니다.');
        }
  };

  // Base64 → Blob 변환 함수
  const base64ToBlob = (base64Data, contentType = 'image/jpeg/jpg') => {
    const byteCharacters = atob(base64Data.split(',')[1]); // 헤더 제거 후 디코딩
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  };
  

  return (
    <>
        <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
        }}>
            <h2>📷 카메라 열기</h2>
            <button onClick={openCamera} style={{
                padding: '12px 24px',
                fontSize: '18px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
            }}>
                카메라 열기
            </button>
        </div>

        <div style={{ marginTop: 20 }}>
            {imageSrc ? (
            <img src={imageSrc} alt="Captured" style={{ maxWidth: '100%', height: 'auto' }} />
            ) : (
            <p>사진이 여기에 표시됩니다.</p>
            )}
        </div>

        <div style={{ width: '300px', padding: '20px 0' }}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}  // 한 번에 하나씩 슬라이드
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}> 

                <img
                // src={`http://192.168.0.32:8081${image.postFilePath.replace(/\\/g, '/')}`}
                  src={`http://192.168.0.32:8081${image.postFilePath}`}
                  alt={`img-${index}`}
                  style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                />
              </SwiperSlide>
              
            ))}
          </Swiper>
        </div>
    </>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    padding: "20px",
  },
  imageBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // 또는 contain
  },
};

export default Camera;
