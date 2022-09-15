import styled from "styled-components";
import SettingIcon from "@mui/icons-material/Settings";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { IParams, RootStore } from "../../../utils/TypeScript";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import LocalOfferTwoToneIcon from "@mui/icons-material/LocalOfferTwoTone";
import SettingsApplicationsTwoToneIcon from "@mui/icons-material/SettingsApplicationsTwoTone";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import GavelSharpIcon from '@mui/icons-material/GavelSharp';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import StarsSharpIcon from '@mui/icons-material/StarsSharp';
import { useState } from "react";
import { Backdrop, Box, Modal, Fade, Button, Typography } from "@mui/material";

const Container = styled.div`
  flex: 2;
  width: 250px;
  background-color: rgb(174, 38, 38);
`;
const WraperContainer = styled.div`
  position: fixed;
  margin-top: 20px;
`;
const WraperCategory = styled.div`
  width: 100%;
`;
const ListCategory = styled.ul`
  list-style: none;
  padding: 10px;
`;
const ItemCategory = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  :hover {
    background-color: #dddeee;
    border-radius: 10px;
  }
`;

const TextCategory = styled.span`
  font-size: 18px;
`;

const ImageCategory = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

/////////////////////Othe//////////////////////////
const WraperOther = styled.div`
  width: 100%;
`;
const ListOther = styled.ul`
  list-style: none;
  padding: 10px;
`;
const ItemOther = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  :hover {
    background-color: #dddeee;
    border-radius: 10px;
  }
`;

const ImageOther = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;
const TextOther = styled.span``;
const NameOther = styled.span`
  display: flex;
  font-weight: bold;
  justify-content: center;
`;

///////////////////////SOCIAL WRAPER////////////////////
const WraperSocial = styled.div`
  width: 100%;
`;

const ListSocial = styled.ul`
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  list-style: none;
`;

const ItemSocial = styled.li`
  float: left;
  :hover {
    background-color: #dddeee;
    border-radius: 20%;
  }
  cursor: pointer;
`;
const WraperImageSocial = styled.div`
  padding: 10px;
`;
const ImageSocial = styled.img`
  width: 32;
  height: 32;
`;

const Model = styled.div`
  width: 600px;
  height: auto;
  padding: 20px;
`;

const Titlemodel = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

const Descmodel = styled.p`
  font-size: 19px;
`;

/////////////////Tags Section////////////////
const WraperMyTags = styled.div`
  width: 100%;
`;
const MyTagSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
`;
const TagTextSection = styled.span`
  font-weight: bold;
  font-size: 16;
`;
const TagWraperImage = styled.div`
  padding: 10px;
  :hover {
    background-color: #dddeee;
  }
  cursor: pointer;
`;
const TagImage = styled.img`
  width: 32;
  height: 32;
`;
const ListTagItem = styled.ul`
  list-style: none;
  padding-left: 10px;
  padding-right: 10px;
`;

const TagItem = styled.li`
  padding: 10px;
  :hover {
    background-color: #dddeee;
  }
  cursor: pointer;
`;
const TagText = styled.span``;

function Sidebar() {
  const history = useHistory();
  const { auth } = useSelector((state: RootStore) => state);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePushPage = (slug:string) => {
    if (!auth.access_token) {
      handleOpen();
    }else{
      history.push(slug);
    }
  };
  
  return (
    <Container>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400",
                backgroundColor: "#fff",
                border: "1px solid #d8d8d8",
                borderRadius: "10px",
              }}
            >
              <Model>
                <div style={{ display: "flex" }}>
                  <Titlemodel>Đăng nhập để tiếp tục</Titlemodel>
                </div>
                <Descmodel>
                  Chúng tôi là nơi các lập trình viên chia sẻ, cập nhật và phát
                  triển sự nghiệp của họ. Nơi chia sẻ những kiến thức bổ ích
                  thuộc lĩnh vực lập trình{" "}
                </Descmodel>
                <button
                  onClick={() => history.push(`/login`)}
                  type="button"
                  className="btn btn-primary"
                  style={{
                    marginRight: "20px",
                    width: "100%",
                    padding: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => history.push(`/register`)}
                  type="button"
                  className="btn"
                  style={{
                    marginRight: "20px",
                    width: "100%",
                    marginTop: "20px",
                  }}
                >
                  Tạo tài khoản
                </button>
              </Model>
            </Box>
          </Fade>
        </Modal>
      </div>
      <WraperContainer>
        <WraperCategory>
          <ListCategory>
            <ItemCategory onClick={() => history.push("/")}>
              <HomeTwoToneIcon color="success" style={{ marginRight: "10px" }} />
              <TextCategory>Trang chủ </TextCategory>
            </ItemCategory>

            <ItemCategory onClick={() => {
              handlePushPage(`/create_blog`);
            }}>
              <BorderColorTwoToneIcon color="secondary" style={{ marginRight: "10px" }} />
              <TextCategory>Tạo Blog</TextCategory>
            </ItemCategory>

            <ItemCategory onClick={() => {
              handlePushPage(`/reading_list`);
            }}>
              <MenuBookTwoToneIcon style={{ marginRight: "10px" }} />
              <TextCategory>Danh sách đọc</TextCategory>
            </ItemCategory>

            <ItemCategory onClick={() => history.push("/toptags")}>
              <LocalOfferTwoToneIcon color="warning"style={{ marginRight: "10px" }} />
              <TextCategory>Thẻ Tags </TextCategory>
            </ItemCategory>

            <ItemCategory>
              <PhoneEnabledIcon color="primary" style={{ marginRight: "10px" }} />
              <TextCategory>Liên hệ </TextCategory>
            </ItemCategory>

            <ItemCategory>
              <GavelSharpIcon color="error" style={{ marginRight: "10px" }} />
              <TextCategory>Chính sách bảo mật </TextCategory>
            </ItemCategory>

            <ItemCategory>
              <StarsSharpIcon color="disabled" style={{ marginRight: "10px" }} />
              <TextCategory>Giới thiệu </TextCategory>
            </ItemCategory>

          </ListCategory>
        </WraperCategory>
      </WraperContainer>
    </Container>
  );
}

export default Sidebar;
