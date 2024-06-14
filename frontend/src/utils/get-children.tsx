import React from "react";

export default function getChildren(children: React.ReactNode) {
  const childrenObject: any = {};

  React.Children.map(
    children,
    (child: any) =>
      (childrenObject[
        `${child?.type?.displayName
          ?.slice(0, 1)
          ?.toLowerCase()}${child?.type?.displayName?.slice(1)}`
      ] = child)
  );

  return childrenObject;
}
