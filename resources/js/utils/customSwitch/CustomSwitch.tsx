import React, { FC, useId, useRef } from "react";
import "./switch.css";

interface customProps {
    label1?: string;
    label2?: string;
    value: boolean;
    isLoading?: boolean;
    showText?: boolean;
    toggle: (e: any) => void;
}

const CustomSwitch: FC<customProps> = ({
    label1,
    label2,
    value,
    toggle,
    isLoading = false,
    showText = true,
}) => {
    const inputId = useId();
    const inputElement = useRef<HTMLInputElement | null>(null);

    const clickElem = () => {
        if (!isLoading) {
            inputElement.current?.click();
        }
    };

    return (
        <div className="container" onClick={clickElem}>
            {showText && label1 ? <p className="label-text">{label1}</p> : ""}{" "}
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    checked={value}
                    className="checkbox"
                    disabled={isLoading}
                    onChange={toggle}
                    name={label2 || inputId}
                    id={inputId}
                    ref={inputElement}
                />
                <label
                    className="label"
                    htmlFor={inputId}
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="inner" />
                    <span className="switch" />
                </label>
            </div>{" "}
            {showText && label2 ? <p className="label-text">{label2}</p> : ""}
        </div>
    );
};

export default CustomSwitch;
