import React, { useState } from "react";
import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    Icon,
    Link,
    Badge,
} from "@chakra-ui/react";
import { MdFavoriteBorder, MdOutlineRemoveRedEye } from "react-icons/md";
import { usePage } from "@inertiajs/react";
import { CustomUsePageProps, ProductInterface } from "./types";
import { useCart } from "@/contexts/CartContext";
// import { addToCart } from "./helpers";

interface ComponentProps {
    product: ProductInterface;
    idx: number;
}

const ProductCard = ({ product, idx }: ComponentProps) => {
    const [hovered, setHovered] = useState(false);
    const images: string[] = Object.values(JSON.parse(product.images));
    const image1: string | undefined = images.length ? images[0] : "";
    const { currency, fsUrl } = usePage<CustomUsePageProps>().props;
    const { addToCart } = useCart();
    // console.log("cur", currency);
    const discount =
        ((Number(product.sale_price) - Number(product.regular_price)) /
            Number(product.regular_price)) *
        100;

    return (
        <Box
            width={"full"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            data-aos={"fade-up"}
            data-aos-delay={idx * 100}
        >
            <Box
                width={"full"}
                height={{ base: "218px", md: "300px", lg: "399px" }}
                rounded={"8px"}
                overflow={"hidden"}
                cursor={"pointer"}
                pos={"relative"}
                bg={"#E3E5E4"}
            >
                <Link href={`/shop/${product.id}`}>
                    <Image
                        src={`${fsUrl}/${image1}`}
                        // src={image1}
                        boxSize={"full"}
                        objectFit={"cover"}
                        alt={"product"}
                        transition={"0.5s ease-out"}
                        opacity={hovered ? 0 : 1}
                    />
                    <Image
                        src={
                            images.length >= 2
                                ? `${fsUrl}/${images[1]}`
                                : `${fsUrl}/${image1}`
                        }
                        boxSize={"full"}
                        objectFit={"cover"}
                        alt={"product"}
                        transition={"0.5s ease-out"}
                        pos={"absolute"}
                        top={0}
                        right={0}
                        opacity={hovered ? 1 : 0}
                        transform={hovered ? "scale(1.05)" : ""}
                    />
                </Link>
                {/* buttons */}
                <>
                    <Button
                        variant={"white"}
                        textTransform={"uppercase"}
                        width={"90%"}
                        mx={"auto"}
                        pos="absolute"
                        right={"50%"}
                        transform={"translateX(50%)"}
                        rounded={"44px"}
                        padding={{ base: "5px 10px", md: "10px" }}
                        height={{ base: 7, md: 10 }}
                        fontSize={"12px"}
                        className={hovered ? "cart-btn-fade-up" : "cart-btn"}
                        onClick={() => {
                            addToCart(
                                product,
                                product?.category?.name || "",
                                `${fsUrl}/${image1}`
                            );
                        }}
                    >
                        Add to cart
                    </Button>
                    <Button
                        variant={"white"}
                        pos={"absolute"}
                        top={"10px"}
                        fontSize={{ base: "20px", md: "24px" }}
                        rounded={"50%"}
                        padding={{ base: 0, md: "5px" }}
                        className={hovered ? "fave-btn-fade-left" : "fave-btn"}
                    >
                        <Icon as={MdFavoriteBorder} />
                    </Button>
                    <Button
                        variant={"white"}
                        pos={"absolute"}
                        top={"60px"}
                        fontSize={{ base: "20px", md: "24px" }}
                        rounded={"50%"}
                        padding={{ base: 0, md: "5px" }}
                        className={
                            hovered ? "fave-btn-fade-left" : "fave-delay"
                        }
                    >
                        <Icon as={MdOutlineRemoveRedEye} />
                    </Button>
                    {product.regular_price ? (
                        <Badge
                            colorScheme="red"
                            variant={"solid"}
                            rounded={"10px"}
                            px={2}
                            pos={"absolute"}
                            top={"15px"}
                            left={"10px"}
                        >
                            {Math.floor(discount)}%
                        </Badge>
                    ) : (
                        ""
                    )}
                </>
            </Box>
            <Flex flexDir={"column"} gap={"4px"} pt={"16px"}>
                <Link
                    href={`/shop/${product.id}`}
                    transition={"0.3s"}
                    fontWeight={500}
                    textTransform={"capitalize"}
                    _hover={{ textDecor: "none", color: "root.secondary" }}
                >
                    {product.name}
                </Link>
                <Flex gap={"8px"} align={"center"}>
                    {product.regular_price ? (
                        <Text
                            textDecor={"line-through"}
                            color={"root.textMutedII"}
                            fontSize={{ base: "12px", md: "14px" }}
                        >
                            {currency?.symbol +
                                Number(product.regular_price)?.toLocaleString(
                                    "en-US"
                                )}
                        </Text>
                    ) : (
                        ""
                    )}
                    <Text
                        fontWeight={600}
                        fontSize={{ base: "14px", md: "16px" }}
                    >
                        {currency.symbol +
                            Number(product.sale_price)?.toLocaleString("en-US")}
                    </Text>
                </Flex>
            </Flex>
        </Box>
    );
};

export default ProductCard;
