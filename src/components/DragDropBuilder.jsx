import React, { useState, useRef, useEffect } from "react";
import { Trash2, Move, Type, Image, Square, List, Edit } from "lucide-react";

const DraggableItem = ({ type, icon: Icon, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex items-center gap-2 p-3 mb-2 bg-white border rounded cursor-move hover:bg-gray-50"
    >
      <Icon size={20} />
      <span>{type}</span>
    </div>
  );
};

const DroppedElement = ({ element, onDelete, onEdit, onDragStart, onDrop }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(
    element.content || "Edit this content"
  );

  const handleEdit = () => {
    setEditing(true);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  const handleBlur = () => {
    setEditing(false);
    onEdit(element.id, content);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleBlur();
    }
  };

  const renderContent = () => {
    if (editing) {
      return (
        <textarea
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[60px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      );
    }

    switch (element.type) {
      case "Heading":
        return <h2 className="text-xl font-bold">{content}</h2>;
      case "Paragraph":
        return <p>{content}</p>;
      case "Image":
        return (
          <div className="flex items-center justify-center p-4 bg-gray-100 rounded">
            <Image size={40} className="text-gray-400" />
          </div>
        );
      case "List":
        return (
          <ul className="pl-6 list-disc">
            {content.split("\n").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      default:
        return <p>{content}</p>;
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, element.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, element.id)}
      className="relative p-4 mb-4 bg-white border rounded group hover:border-blue-500"
    >
      {/* Control buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white shadow-sm rounded p-1">
        <button
          onClick={handleEdit}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Edit"
        >
          <Edit size={16} className="text-blue-600" />
        </button>
        <button
          onClick={() => onDelete(element.id)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
        <div className="p-1 cursor-move" title="Drag to reorder">
          <Move size={16} className="text-gray-600" />
        </div>
      </div>

      {/* Content area */}
      <div className="min-h-[50px] pt-4">{renderContent()}</div>
    </div>
  );
};

const DragDropBuilder = () => {
  const [elements, setElements] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const nextId = useRef(1);

  const handleSidebarDragStart = (e, type) => {
    setDraggedItem({ type, isNew: true });
  };

  const handleElementDragStart = (e, id) => {
    setDraggedItem({ id, isNew: false });
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.isNew) {
      const newElement = {
        id: nextId.current++,
        type: draggedItem.type,
        content: `New ${draggedItem.type}`,
      };
      setElements([...elements, newElement]);
    }
    setDraggedItem(null);
  };

  const handleElementDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedItem || !draggedItem.id || draggedItem.id === targetId) return;

    const sourceIndex = elements.findIndex((el) => el.id === draggedItem.id);
    const targetIndex = elements.findIndex((el) => el.id === targetId);

    const newElements = [...elements];
    const [removed] = newElements.splice(sourceIndex, 1);
    newElements.splice(targetIndex, 0, removed);

    setElements(newElements);
    setDraggedItem(null);
  };

  const handleDelete = (id) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  const handleEdit = (id, newContent) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, content: newContent } : el
      )
    );
  };

  const loadHandler = () => {
    console.log(JSON.parse(localStorage.getItem("elements")));
    setElements(JSON.parse(localStorage.getItem("elements")));
  };

  const saveHandler = () => {
    localStorage.setItem("elements", JSON.stringify(elements));
    console.log(elements);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full  md:w-64 p-4 bg-white border-r ">
        <h2 className="mb-4 text-lg font-semibold text-center">Elements</h2>
        <button onClick={loadHandler} className="bg-slate-300 rounded mx-4 px-3 py-2 my-2">Load</button>
        <button onClick={saveHandler} className="bg-slate-300 rounded mx-4 px-3 py-2 my-2">Save</button>
        <DraggableItem
          type="Heading"
          icon={Type}
          onDragStart={handleSidebarDragStart}
        />
        <DraggableItem
          type="Paragraph"
          icon={Square}
          onDragStart={handleSidebarDragStart}
        />
        <DraggableItem
          type="Image"
          icon={Image}
          onDragStart={handleSidebarDragStart}
        />
        <DraggableItem
          type="List"
          icon={List}
          onDragStart={handleSidebarDragStart}
        />
      </div>

      {/* Canvas */}
      <div
        className="flex-1 p-8 overflow-auto"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCanvasDrop}
      >
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Drag elements here
          </div>
        ) : (
          elements.map((element) => (
            <DroppedElement
              key={element.id}
              element={element}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onDragStart={handleElementDragStart}
              onDrop={handleElementDrop}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DragDropBuilder;
