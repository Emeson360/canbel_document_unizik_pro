import React from "react";
import { Button, Link } from "@chakra-ui/react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import "./Pagination.css";
import { myAppendQueryParam } from "./helpers";

interface PaginationProps {
    limit: number;
    curPage: number;
    totalItems: number;
    url: string;
}

const Pagination = ({ limit, curPage, totalItems }: PaginationProps) => {
    const pageNumbers = [];
    const totalPage = Math.ceil(totalItems / limit);

    for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="paginationContainer">
            <ul className="pagination">
                <li className="page-item">
                    <Button
                        as={Link}
                        href={`${window.location.pathname}?${myAppendQueryParam(
                            { pg: Number(curPage) - 1 }
                        )}`}
                        variant={"ghost"}
                        isDisabled={Number(curPage) === 1}
                        size={"sm"}
                    >
                        <IoChevronBackOutline />
                    </Button>
                </li>
                {pageNumbers?.map((pg) => (
                    <li key={"pg-" + pg} className="page-item">
                        <Button
                            as={Link}
                            href={`${
                                window.location.pathname
                            }?${myAppendQueryParam({ pg: pg })}`}
                            variant={Number(curPage) === pg ? "solid" : "ghost"}
                            size={"sm"}
                            fontWeight={400}
                        >
                            {pg}
                        </Button>
                    </li>
                ))}
                <li className="page-item">
                    <Button
                        as={Link}
                        href={`${window.location.pathname}?${myAppendQueryParam(
                            { pg: Number(curPage) + 1 }
                        )}`}
                        variant={"ghost"}
                        isDisabled={Number(curPage) >= totalPage}
                        size={"sm"}
                    >
                        <IoChevronForwardOutline />
                    </Button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
