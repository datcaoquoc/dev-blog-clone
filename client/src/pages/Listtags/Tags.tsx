import { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Backdrop, Box, Modal, Fade } from "@mui/material";
import { ALERT } from "../../redux/types/alertType";
import { useDispatch } from "react-redux";
import { getAPI,patchAPI } from "../../utils/FetchData";
import { useSelector } from "react-redux";
import { IParams, RootStore } from "../../utils/TypeScript";

const Tags = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootStore) => state);
  const [listtag, setListtag] = useState([]);
  const [open, setOpen] = useState(false);
  const [taguser, setTaguser] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!auth.user) return;
    var c:any = auth.user?.my_tags
    setTaguser(c)

  }, [auth]);

  useEffect(() => {
    dispatch({ type: ALERT, payload: { loading: true } });
    async function fetchMyAPI() {
      await getAPI("get-list-tag-top")
        .then((res) => {
          setListtag(res.data.listtag);
          // console.log(res.data.listtag);
          dispatch({ type: ALERT, payload: { loading: false } });
        })
        .catch((err) => {
          history.replace("/not-found");
        });
    }
    fetchMyAPI();
  }, []);

  const followtag = async (id:any) => {
    if (!auth.access_token) return handleOpen();
    await patchAPI(
      `follow-tag`,
      { idtag: id },
      auth.access_token
    ).then((res) => {
        setTaguser(res.data.result.my_tags)
    }).catch(err => {
        // dispatch({ type: ALERT, payload: { errors: err.response.msg } });
    })
  };

  const unfollowtag = async (id: any) => {
    if (!auth.access_token) return handleOpen();
    await patchAPI(
        `unfollow-tag`,
        { idtag: id },
        auth.access_token
      ).then((res) => {
        setTaguser(res.data.result.my_tags)
      }).catch(err => {
        // dispatch({ type: ALERT, payload: { errors: "C?? l???i s???y ra" } });
      })
  };

  return (
    <Container>
      {(listtag && taguser) && (
        <>
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
                      <Titlemodel>????ng nh???p ????? ti???p t???c</Titlemodel>
                    </div>
                    <Descmodel>
                      Ch??ng t??i l?? n??i c??c l???p tr??nh vi??n chia s???, c???p nh???t v??
                      ph??t tri???n s??? nghi???p c???a h???. N??i chia s??? nh???ng ki???n th???c
                      b??? ??ch thu???c l??nh v???c l???p tr??nh{" "}
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
                      ????ng nh???p
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
                      T???o t??i kho???n
                    </button>
                  </Model>
                </Box>
              </Fade>
            </Modal>
          </div>
          <div className="container">
            <div className="row " style={{ paddingTop: "30px" }}>
              <div className="col">
                <h1 style={{ fontWeight: "bold" }}>C??c th??? Tag h??ng ?????u</h1>
              </div>
              {/* <div className="col">
                <div className="d-flex justify-content-end">
                    {auth.access_token ? <button type="button" className="btn btn-outline-secondary">
                    <span className="font-weight-bold">Th??? ??ang theo d??i</span>
                  </button> : null}
                  
                </div>
              </div> */}
            </div>
          </div>

          <Listtag className="container">
            {listtag.map((tag: any, index) => (
              <ItemBody key={index}>
                <Top></Top>
                <Nametag onClick={() => history.push(`/tags/${tag._id}`)}>
                  #{tag.name}
                </Nametag>
                <Desctag>{tag.description}</Desctag>
                <Totaltagblog>
                  {tag.total_blog} b??i vi???t ???????c xu???t b???n
                </Totaltagblog>
                
                  {taguser.some((check: any) => {
                    return check.idtag.toString() == tag._id;
                  }) ? (
                    <button style={{
                        marginLeft: '20px',
                        fontWeight: '600'
                        }} onClick={() => unfollowtag(tag._id)} type="button" className="btn btn-outline-secondary">
                    B??? theo d??i
                  </button>
                  ) : (
                    <button style={{
                        marginLeft: '20px',
                        fontWeight: '600'
                        }} onClick={() => followtag(tag._id)} type="button" className="btn btn-primary">
                    Theo d??i
                  </button>
                  )}
              </ItemBody>
            ))}
          </Listtag>
        </>
      )}
    </Container>
  );
};
export default Tags;

const Container = styled.div`
  background-color: #efefef;
  width: 100%;
  height: auto;
`;

const Listtag = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  height: auto;
`;

const Top = styled.div`
  background-color: #0EB3E0;
  width: 100%;
  height: 20px;
  border-radius: 7px 7px 0px 0px;
`;

const Nametag = styled.p`
  cursor: pointer;
  font-size: 23px;
  font-weight: bold;
  display: inline-flex;
  margin: 20px;
  :hover {
    color: blue;
  }
`;

const Desctag = styled.p`
  font-size: 17px;
  margin: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const Totaltagblog = styled.p`
  font-size: 17px;
  text-align: justify;
  margin: 10px 20px;
  color: #707070;
`;

const ItemBody = styled.div`
  background-color: #ffffff;
  width: 350px;
  height: auto;
  margin: 10px;
  border-radius: 7px;
  border: 1px solid #bfbfbf;
  padding-bottom: 25px;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;

const Wrapbutton = styled.div``;

// const Button = styled.button<{ active?: boolean }>`
//   border: none;
//   width: 100%;
//   background-color: ${(props) => (props.active ? "white" : "")};
//   font-weight: ${(props) => (props.active ? "bold" : "")};
//   text-align: start;
//   padding: 10px;
//   border-radius: 5px;
//   :hover {
//     background-color: ${(props) => (props.active ? "" : "#dddeee")};
//     color: blue;
//   }
// `;
// model
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
