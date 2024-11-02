  WITH RECURSIVE user_nodes AS (
  SELECT 
    file_public_id,
    node_id, 
    parent_node_id,
    type
  FROM 
    "nodes"
  WHERE 
    node_id = $1
  UNION 
    SELECT 
      r_nodes.file_public_id,
      r_nodes.node_id,
      r_nodes.parent_node_id,
      r_nodes.type
    FROM 
      "nodes" r_nodes 
    INNER JOIN user_nodes r_nodes1 
      ON r_nodes.parent_node_id = r_nodes1.node_id
) SELECT
  file_public_id
FROM 
  user_nodes
WHERE 
  user_nodes.TYPE = 'FILE' AND user_nodes.file_public_id IS NOT NULL
;