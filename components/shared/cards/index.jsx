import styled from "styled-components";
import ImageBlock from "./imageBlock";
import TextBlock from "./textBlock";
import CardButtonGroup from './textBlock/CardButtonGroup';
import { FaCartPlus } from 'react-icons/fa';
import { FaInfo } from 'react-icons/fa';
import Button from "../buttons";
import Link from 'next/link'

const BaseCard = styled.div`
  margin: 1rem 0.5rem;
  border: 1px solid #eee;
  border-radius: 10px;
  transition: 0.5s;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  &:hover {
    transform: scale(1.025);
  }
`;

const Card = ({item}) => {
  const ImgUrl = typeof item.productImage.url == "string" ? item.productImage.url : item.productImage[0].url
  const detailsLink = `/product/${item.id}`
  return (
    <BaseCard>
      <ImageBlock url={ImgUrl} alterTag= {item?.productName} />
      <TextBlock item={item} />
      <CardButtonGroup >
        <Button bg="primary">
          Add Card <FaCartPlus />{" "}
        </Button>
        < Link  href={detailsLink}>
          <Button> 
            Details <FaInfo />{" "}
          </Button>
        </Link>
      </CardButtonGroup >
    </BaseCard>
  );
};

export default Card