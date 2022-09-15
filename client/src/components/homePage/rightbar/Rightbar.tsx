import styled from "styled-components";
import NewIcon from "@mui/icons-material/FiberNewOutlined";
import Tags from "../../../pages/Listtags/Tags";
import { useHistory } from "react-router-dom";
const Container = styled.div`
  flex: 2.5;
  padding: 20px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const PostNewOfTagsWraper = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #D8D8D8;
`;

const PostNewOfTagsWraper1 = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;

  border: 1px solid #D8D8D8;
`;

const WraperRowPost = styled.div`
  padding: 10px;
  :hover {
    background-color: #ffffff;
  }
  cursor: pointer;
  border-top: 1px solid #D8D8D8;
`;
const WraperRowName = styled.div`
  padding: 10px;
  background-color: #008CFF;
  border-radius: 10px 10px 0px 0px;
`;
const Div = styled.div``;
const NameTag = styled.span`
  font-weight: bold;
`;
const Content = styled.p``;
const Comment = styled.div``;

const Img = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 10px;

`;


const Rightbar = (props: any) => {
  const history = useHistory()
  return (
    <Container>
 <PostNewOfTagsWraper1>
        <Img src="https://thepracticaldev.s3.amazonaws.com/i/6hqmcjaxbgbon8ydw93z.png"></Img>
        <Content>Gần 700 nhà phát triển đã đóng góp vào cơ sở mã Forem cung cấp năng lượng cho DEV và các cộng đồng khác. 🤯</Content>
        </PostNewOfTagsWraper1>
        {props.listtagblog.map((tag: any, index: number) => (<>
          <PostNewOfTagsWraper key={index}>
          <WraperRowName>
            <NameTag>#{tag.namecategory}</NameTag>
          </WraperRowName>
            {tag.listpost.map((blog:any, index: number) => (
                <WraperRowPost key={index}>
                <Div onClick={()=> history.push(`/blog/${blog._id}`)}>
                  <Content>
                    {blog.title}
                  </Content>
                </Div>
              </WraperRowPost>
            ))}
</PostNewOfTagsWraper>
        </>

        ))}
    </Container>
  );
};
export default Rightbar;
