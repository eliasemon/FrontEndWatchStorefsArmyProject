import { useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { cartItemsVar, Loading2, message } from "../../../apolloClient";
import { client } from "../../../apolloClient/index";
import { getAddress, mutatedAddress, mutationOrder } from "../../../graphql";
import AddressForm from "../../modal/address";
import Modal2 from "../../modal/modal2";
import Button from "../../shared/buttons";
import Bar from "../../shared/texts/Bar";
import BlockText from "../../shared/texts/BlockText";
import {
  AddressHeader,
  CartItemList,

  CompleteButton,
  CompleteOrder,
  Key,
  OrderList,
  OrderState,
  PlaceOrder,
  SingleOrder,


  UserAddress,
  UserAddressGroup,
  Value,
} from "../CartComponents";
import CartItem from "../CartItem";
import ItemTittle from "../ItemTittle";
import { justifySpaceBetween } from "../../../utils/display.styled";


const InfoContainer2 = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
  padding: 10px;
  margin: 0 auto;

  @media screen and (min-width: 420px) and (max-width: 480px) {
    display: flex;
    flex-direction: column;
    font-size: ${({ theme }) => theme?.fontSizes?.md};
  }
`;
const CartInfoWrap = styled.div`
  flex: 3;
  padding: 2%;
  background-color: ${({ theme }) => theme?.color?.white};
`;

const Hader = styled.div`
  ${justifySpaceBetween}
  width: 100%;
`;
const CartTitle = styled.h3``;

const CheckoutForm = ({ userID, children, pocketKhali }) => {
  const router = useRouter();
  const cartData = useReactiveVar(cartItemsVar);

  const [addressId, setAddressID] = useState("");
  const { data, loading, refetch } = useQuery(getAddress(userID));
  const [controleModal, setModalcontroleModal] = useState(false);
  const [addessFromData, setAddressFromData] = useState({});
  const [arektaOrderKor, setArektaOrderKor] = useState(false);

  const [createOrderResponse, setCreateOrderResponse] = useState("");
  useEffect(() => {
    if (loading) {
      Loading2(true);
    } else {
      setAddressID(data?.addresses[0]?.id);
      Loading2(false);
    }
  }, [loading]);

  const handleChange = (e) => {
    setAddressFromData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const addressSubmitHandle = async () => {
    try {
      Loading2(true);
      await client.mutate({
        mutation: mutatedAddress(addessFromData, userID),
      });
      Loading2(false);
      refetch();
      setModalcontroleModal(false);
      message({ type: "success", body: "Address Created SuccessFully" });
    } catch (error) {
      message({
        type: "failed",
        body: "Something went wrong , please type correctly",
      });
      Loading2(false);
      console.log(error);
    }
  };

  const placeOrder = async () => {
    if (!addressId) {
      message({ type: "alert", body: "Plz Select an Address" });
      return;
    }

    try {
      Loading2(true);
      const RefinedCartData = cartData.map((v) => {
        return {
          product_quantity: v.product_quantity,
          product_ref: v.product_ref,
          variantsId: v.variantsId,
        };
      });
      const { data, error } = await client.mutate({
        mutation: mutationOrder(RefinedCartData, addressId, "cashon"),
      });

      message({ type: "success", body: "Order Created Successfuly" });
      cartItemsVar([]);
      setArektaOrderKor(true);
      setCreateOrderResponse(data);
      Loading2(false);
    } catch (error) {
      message({ type: "failed", body: "SomeThing Went Worng" });
      Loading2(false);
      setArektaOrderKor(false);
      console.log(error);
    }
  };
  if (arektaOrderKor) {
    return (
      <CompleteOrder>
        <BlockText size="lg">
          Hey{" "}
          {createOrderResponse.MakeOrder.ordersInformation.user_ref.username} !
        </BlockText>
        <BlockText size="xl" color="primary">
          Thank you
        </BlockText>
        <BlockText size="lg">You order has been completed !</BlockText>
        <BlockText size="md">You order id is #{createOrderResponse.MakeOrder.ordersInformation.id} </BlockText>
        {/* <OrderList>
          <SingleOrder>
            <OrderState>
              <BlockText size="md" weight="semiBold">
                Product Name and quantity
              </BlockText>
            </OrderState>
            <BlockText weight="semiBold">Order Number</BlockText>
          </SingleOrder>
          {createOrderResponse.MakeOrder.ordersInformation.ordersItem.map(
            (item) => (
              <SingleOrder>
                <OrderState>
                  <BlockText size="md" weight="medium">
                    {item.productName}
                  </BlockText>
                  <BlockText>x{item.product_quantity}</BlockText>
                </OrderState>
                <BlockText weight="medium">{item.id}</BlockText>
              </SingleOrder>
            )
          )}
        </OrderList> */}
        <br />
        <CompleteButton>
          <Button
            onClick={() => {
              setArektaOrderKor(false);
              router.push("/");
            }}
            bg="primary"
            fontSize="md"
          >
            Go Back Home
          </Button>
          <Button
            onClick={() => {
              setArektaOrderKor(false);
              router.push("/collections");
            }}
            fontSize="md"
          >
            Continue Shopping
          </Button>
        </CompleteButton>
        {/* <BlockText>{JSON.stringify(createOrderResponse)}</BlockText> */}
      </CompleteOrder>
    );
  }

  return (
    <CartInfoWrap>
      <Hader>
        <CartTitle>Heading Towards Checkout</CartTitle>
        <Button bg="primary" onClick={() => pocketKhali(false)}>
          Back to Cart
        </Button>
      </Hader>
      <Bar width="full" height="sm" />
      {/* <Form /> */}
      <InfoContainer2>
        <div>
          <ItemTittle />
          <CartItemList>
            {cartData.map((item, index) => (
              <CartItem
                key={index}
                variantsId={item.variantsId}
                product_ref={item.product_ref}
                productImage={item.productImage}
                productName={item.productName}
                productBrand={item.productBrand}
                color={item.color}
                price={item.price}
                product_quantity={item.product_quantity}
                index={index}
                isActionButton={true}
              />
            ))}
          </CartItemList>
        </div>
        {children}
      </InfoContainer2>
      <AddressHeader>
        <BlockText size="md" weight="medium">
          Select delivery location
        </BlockText>
        <Button onClick={() => setModalcontroleModal(true)} bg="primary">
          {" "}
          Add New Address{" "}
        </Button>
      </AddressHeader>
      <UserAddressGroup>
        {data?.addresses?.map((value, index) => {
          console.log(value);
          return (
            <>
              <UserAddress
                key={index}
                onClick={() => setAddressID(value.id)}
                primary={value.id == addressId}
                // style={{
                //   backgroundColor: `${value.id == addressId ? "red" : "gray"}`,
                // }}
              >
                <div>
                  <Key>Address:</Key> <Value>{value.address}</Value>
                </div>
                <div>
                  <Key>Street Address:</Key>{" "}
                  <Value>{value.streetAddress}</Value>
                </div>
                <div>
                  <Key>City:</Key> <Value>{value.city}</Value>
                </div>
                <div>
                  <Key>State:</Key> <Value>{value.state_Province_Region}</Value>
                </div>
                <div>
                  <Key>Zip Code:</Key> <Value>{value.zipCode}</Value>
                </div>
                <div>
                  <Key>Country:</Key> <Value>{value.country}</Value>
                </div>
                <div>
                  <Key>Phone Number:</Key> <Value>{value?.phoneNumber}</Value>
                </div>
              </UserAddress>
              {/* <div
              key={index}
              onClick={() => setAddressID(v.id)}
              style={{
                backgroundColor: `${v.id == addressId ? "red" : "gray"}`,
              }}
              >
            </div> */}
            </>
          );
        })}
      </UserAddressGroup>
      {controleModal && (
        <Modal2 modalController={setModalcontroleModal}>
          <AddressForm handleChange={handleChange} isFromCheckOut={true} />
          <Button onClick={addressSubmitHandle}>Submit</Button>
        </Modal2>
      )}

      <PlaceOrder>
        <BlockText size="md">Only CashOn Delivary is Available</BlockText>
        <Button fontSize="lg" bg="primary" onClick={placeOrder}>
          Place Order
        </Button>
      </PlaceOrder>

    </CartInfoWrap>
  );
};

export default CheckoutForm;
