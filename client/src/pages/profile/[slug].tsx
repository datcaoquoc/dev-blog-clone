import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import styled from "styled-components";
import Loadmore from "../../components/alert/Loadmore";
import InfiniteScroll from "react-infinite-scroll-component";
import CardBlogProfile from './CardBlogProfile';
import Pinned from "./Pinned";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BookIcon from '@mui/icons-material/Book';
import ForumIcon from '@mui/icons-material/Forum';
import TagIcon from '@mui/icons-material/Tag';
import { UserInformation } from "./UserInformation";
import { IParams, RootStore } from '../../utils/TypeScript'
import { getOtherInfo } from '../../redux/actions/userAction';
import { getBlogsByUserId } from '../../redux/actions/blogAction';
import { postAPI, getAPI, putAPI, deleteAPI } from '../../utils/FetchData';
import Loading from '../../components/global/Loading';
import { useLocation } from 'react-router-dom'; 


const Profile = () => {
  const { slug }: IParams = useParams()
  const location = useLocation();
  const [page, setPage] = useState(2);
  const [hasmore, setHasmore] = useState(true);
  const { auth } = useSelector((state: RootStore) => state)
  const { otherInfo } = useSelector((state: RootStore) => state)
  const { blogsUser } = useSelector((state: RootStore) => state)
  const [bloguser, setBloguser] = useState([])
  const [loaduser, setLoaduser] = useState(true)
  const dispatch = useDispatch()
  const history = useHistory()

  const fetchData = async () => {
    setPage(Number(page + 1));
    await getAPI(`blog-by-user/${slug}/${page}`)
      .then((res) => {
        if (res.data.result.length < 3) {
          setHasmore(false);
        }
        let array = bloguser.concat(res.data.result);
        setBloguser(array);
      })
      .catch((err) => {
        console.log("lôie");
      });
  };

  useEffect(() => {
    async function fetchMyAPI() {
      window.scrollTo(0, 0);
      setLoaduser(true)
    if(!slug) return;
    try {
      await dispatch(getOtherInfo(slug));
      const res = await getAPI(`blog-by-user/${slug}/${1}`)
      if (res.data.result.length < 3) {
        setHasmore(false);
      }else{
        setHasmore(true);
      }
      setBloguser(res.data.result)
      setLoaduser(false)
    } catch (error) {
      return history.replace('/not-found')
    }
    }
    fetchMyAPI()
  }, [location, slug])
  return (
    <>
    {loaduser && <Loading />}
    {(loaduser === false && otherInfo) && <>
    
    <Container>
      <UserInformation user={otherInfo}/>
      <With100>
        <ContainerBottom>
          <Left>
            {otherInfo.userinfor?.learning === "" ? null : 
            <LeftWrapTag>
              <TagTitle>
                <SpanTitle>Học vấn</SpanTitle>
              </TagTitle>
              <TagContent>
                <SpanContent>
                  {otherInfo.userinfor?.learning}
                </SpanContent>
              </TagContent>
            </LeftWrapTag>}
            {/* <LeftWrapTag>
              <TagTitle>
                <SpanTitle>Skills/Languages</SpanTitle>
              </TagTitle>
              <TagContent>
                <SpanContent>infomation</SpanContent>
              </TagContent>
            </LeftWrapTag> */}

            <LeftWrapTag>
              <TagContent>
              <p>
                  <PersonOutlineIcon color="primary"></PersonOutlineIcon>
                   {` `}{otherInfo.userinfor?.follower.length} Người theo dõi
                </p>
                <p>
                  <BookIcon color="secondary"></BookIcon>
                   {` `}{otherInfo.blogPublishedCount} Blog đã đăng
                </p>
                <p>
                  <ForumIcon color="success"></ForumIcon>
                   {` `}{otherInfo.commentsCount} Bình luận
                </p>
                <p>
                  <TagIcon color="action"></TagIcon>
                  {` `}{otherInfo.tagfollowCount} Thẻ tag theo dõi
                </p>
              </TagContent>
            </LeftWrapTag>
          </Left>

          <Right>
            {
              otherInfo.blogPin?.length === 0 ? null :
              <Pinned blog={otherInfo.blogPin}/>
            }
           
            {/* <Wraper> {
              otherInfo.commentRecent?.length === 0 ? null : <>{Recentcomments(otherInfo.commentRecent)}</>
            }</Wraper> */}
            {bloguser && <>
              {bloguser.length === 0 ? null : <Wraper> 
                {/* {bloguser.map((blog, index) => (
                  <>
                  {cardPostNoImgaepin(blog)}
                  </>
                ))} */}
                <InfiniteScroll
                            dataLength={bloguser.length}
                            next={fetchData}
                            hasMore={hasmore}
                            loader={<Loading />}
                            endMessage={<p></p>}
                          >
                            <>
                              {bloguser.map((blog: any, index) => (
                                <>
                                 {/* {cardPostNoImgaepin(blog)} */}
                                 <CardBlogProfile blog={blog}/>
                                </>
                              ))}
                            </>
                          </InfiniteScroll>
                </Wraper>}
              
            </>}
          </Right>
        </ContainerBottom>
      </With100>
    </Container>
    </>} 
    </>
  )
}

const Container = styled.div`
  width: 100%;
  background-color: #efefef;
`;

const With100 = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const ContainerBottom = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 3;
  margin-right: 10px;
`;
const Right = styled.div`
  flex: 7;
`;

const Wraper = styled.div`
  
`;
const LeftWrapTag = styled.div`
  border: 1px solid #d8d8d8;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 5px;
`;
const TagTitle = styled.div`
  padding: 10px;
  border-bottom: 1px solid #d8d8d8;
`;
const SpanTitle = styled.span`
  font-weight: bold;
`;
const TagContent = styled.div`
  padding: 10px;
`;
const SpanContent = styled.span``;


export default Profile