import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CrewManager } from './crews/CrewManager';
import type { TableSchema } from './crews/types';
import { GROQ_API_KEY } from './config';

type GroqModel = {
  id: string;
  owned_by?: string;
};

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<GroqModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instant');

  const schema: TableSchema[] = [
    
  {
    "tables": [
      {
        "fields": [
          {
            "name": "category_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'category_id' column of the 'categories' table."
          },
          {
            "name": "category_name",
            "type": "character varying",
            "example": "Books,Clothing,Electronics",
            "description": "This is the 'category_name' column of the 'categories' table."
          },
          {
            "name": "created_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'created_at' column of the 'categories' table."
          },
          {
            "name": "updated_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'updated_at' column of the 'categories' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "categories",
        "description": "",
        "relationships": [
          {
            "column": "category_id",
            "referenced_table": "categories",
            "referenced_column": "category_id",
            "referenced_schema": "public"
          },
          {
            "column": "category_name",
            "referenced_table": "categories",
            "referenced_column": "category_name",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "product_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'product_id' column of the 'products' table."
          },
          {
            "name": "category_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'category_id' column of the 'products' table."
          },
          {
            "name": "product_name",
            "type": "character varying",
            "example": "Smartphone,T-Shirt,Jeans",
            "description": "This is the 'product_name' column of the 'products' table."
          },
          {
            "name": "description",
            "type": "text",
            "example": "High-performance laptop with 1",
            "description": "This is the 'description' column of the 'products' table."
          },
          {
            "name": "price",
            "type": "numeric",
            "example": "14.99,49.99,89.99",
            "description": "This is the 'price' column of the 'products' table."
          },
          {
            "name": "stock_quantity",
            "type": "integer",
            "example": "197,119,19",
            "description": "This is the 'stock_quantity' column of the 'products' table."
          },
          {
            "name": "created_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'created_at' column of the 'products' table."
          },
          {
            "name": "updated_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'updated_at' column of the 'products' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "products",
        "description": "",
        "relationships": [
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          },
          {
            "column": "category_id",
            "referenced_table": "categories",
            "referenced_column": "category_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "user_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'user_id' column of the 'users' table."
          },
          {
            "name": "first_name",
            "type": "character varying",
            "example": "Alice,Jane,Michael",
            "description": "This is the 'first_name' column of the 'users' table."
          },
          {
            "name": "last_name",
            "type": "character varying",
            "example": "Doe,Johnson,Smith",
            "description": "This is the 'last_name' column of the 'users' table."
          },
          {
            "name": "email",
            "type": "character varying",
            "example": "alice.j@example.com,david.wils",
            "description": "This is the 'email' column of the 'users' table."
          },
          {
            "name": "password",
            "type": "character varying",
            "example": "securepassword,emilypass,alice",
            "description": "This is the 'password' column of the 'users' table."
          },
          {
            "name": "created_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'created_at' column of the 'users' table."
          },
          {
            "name": "updated_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'updated_at' column of the 'users' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "users",
        "description": "",
        "relationships": [
          {
            "column": "user_id",
            "referenced_table": "users",
            "referenced_column": "user_id",
            "referenced_schema": "public"
          },
          {
            "column": "email",
            "referenced_table": "users",
            "referenced_column": "email",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "order_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'order_id' column of the 'orders' table."
          },
          {
            "name": "user_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'user_id' column of the 'orders' table."
          },
          {
            "name": "order_date",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'order_date' column of the 'orders' table."
          },
          {
            "name": "status",
            "type": "character varying",
            "example": "Pending,Processing,Shipped",
            "description": "This is the 'status' column of the 'orders' table."
          },
          {
            "name": "total_amount",
            "type": "numeric",
            "example": "99.98,89.99,34.98",
            "description": "This is the 'total_amount' column of the 'orders' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "orders",
        "description": "",
        "relationships": [
          {
            "column": "order_id",
            "referenced_table": "orders",
            "referenced_column": "order_id",
            "referenced_schema": "public"
          },
          {
            "column": "user_id",
            "referenced_table": "users",
            "referenced_column": "user_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "order_item_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'order_item_id' column of the 'order_items' table."
          },
          {
            "name": "order_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'order_id' column of the 'order_items' table."
          },
          {
            "name": "product_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'product_id' column of the 'order_items' table."
          },
          {
            "name": "quantity",
            "type": "integer",
            "example": "2,1",
            "description": "This is the 'quantity' column of the 'order_items' table."
          },
          {
            "name": "price",
            "type": "numeric",
            "example": "14.99,49.99,89.99",
            "description": "This is the 'price' column of the 'order_items' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "order_items",
        "description": "",
        "relationships": [
          {
            "column": "order_item_id",
            "referenced_table": "order_items",
            "referenced_column": "order_item_id",
            "referenced_schema": "public"
          },
          {
            "column": "order_id",
            "referenced_table": "orders",
            "referenced_column": "order_id",
            "referenced_schema": "public"
          },
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          },
          {
            "column": "order_item_id",
            "referenced_table": "order_items",
            "referenced_column": "order_item_id",
            "referenced_schema": "public"
          },
          {
            "column": "order_id",
            "referenced_table": "orders",
            "referenced_column": "order_id",
            "referenced_schema": "public"
          },
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "cart_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'cart_id' column of the 'carts' table."
          },
          {
            "name": "user_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'user_id' column of the 'carts' table."
          },
          {
            "name": "created_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'created_at' column of the 'carts' table."
          },
          {
            "name": "updated_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'updated_at' column of the 'carts' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "carts",
        "description": "",
        "relationships": [
          {
            "column": "cart_id",
            "referenced_table": "carts",
            "referenced_column": "cart_id",
            "referenced_schema": "public"
          },
          {
            "column": "user_id",
            "referenced_table": "users",
            "referenced_column": "user_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "cart_item_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'cart_item_id' column of the 'cart_items' table."
          },
          {
            "name": "cart_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'cart_id' column of the 'cart_items' table."
          },
          {
            "name": "product_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'product_id' column of the 'cart_items' table."
          },
          {
            "name": "quantity",
            "type": "integer",
            "example": "2,1",
            "description": "This is the 'quantity' column of the 'cart_items' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "cart_items",
        "description": "",
        "relationships": [
          {
            "column": "cart_item_id",
            "referenced_table": "cart_items",
            "referenced_column": "cart_item_id",
            "referenced_schema": "public"
          },
          {
            "column": "cart_id",
            "referenced_table": "carts",
            "referenced_column": "cart_id",
            "referenced_schema": "public"
          },
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          },
          {
            "column": "cart_item_id",
            "referenced_table": "cart_items",
            "referenced_column": "cart_item_id",
            "referenced_schema": "public"
          },
          {
            "column": "cart_id",
            "referenced_table": "carts",
            "referenced_column": "cart_id",
            "referenced_schema": "public"
          },
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "payment_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'payment_id' column of the 'payments' table."
          },
          {
            "name": "order_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'order_id' column of the 'payments' table."
          },
          {
            "name": "payment_date",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'payment_date' column of the 'payments' table."
          },
          {
            "name": "payment_method",
            "type": "character varying",
            "example": "PayPal,Debit Card,Credit Card",
            "description": "This is the 'payment_method' column of the 'payments' table."
          },
          {
            "name": "payment_status",
            "type": "character varying",
            "example": "Pending,Processing,Shipped",
            "description": "This is the 'payment_status' column of the 'payments' table."
          },
          {
            "name": "amount",
            "type": "numeric",
            "example": "99.98,89.99,34.98",
            "description": "This is the 'amount' column of the 'payments' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "payments",
        "description": "",
        "relationships": [
          {
            "column": "payment_id",
            "referenced_table": "payments",
            "referenced_column": "payment_id",
            "referenced_schema": "public"
          },
          {
            "column": "order_id",
            "referenced_table": "orders",
            "referenced_column": "order_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "address_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'address_id' column of the 'addresses' table."
          },
          {
            "name": "user_id",
            "type": "integer",
            "example": "4,6,3",
            "description": "This is the 'user_id' column of the 'addresses' table."
          },
          {
            "name": "address_line_1",
            "type": "character varying",
            "example": "321 Pine Street,123 Elm Street",
            "description": "This is the 'address_line_1' column of the 'addresses' table."
          },
          {
            "name": "address_line_2",
            "type": "character varying",
            "example": "",
            "description": "This is the 'address_line_2' column of the 'addresses' table."
          },
          {
            "name": "city",
            "type": "character varying",
            "example": "New York,San Francisco,Austin",
            "description": "This is the 'city' column of the 'addresses' table."
          },
          {
            "name": "state",
            "type": "character varying",
            "example": "CA,TX,NY",
            "description": "This is the 'state' column of the 'addresses' table."
          },
          {
            "name": "postal_code",
            "type": "character varying",
            "example": "73301,90001,94101",
            "description": "This is the 'postal_code' column of the 'addresses' table."
          },
          {
            "name": "country",
            "type": "character varying",
            "example": "USA",
            "description": "This is the 'country' column of the 'addresses' table."
          },
          {
            "name": "created_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'created_at' column of the 'addresses' table."
          },
          {
            "name": "updated_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'updated_at' column of the 'addresses' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "addresses",
        "description": "",
        "relationships": [
          {
            "column": "address_id",
            "referenced_table": "addresses",
            "referenced_column": "address_id",
            "referenced_schema": "public"
          },
          {
            "column": "user_id",
            "referenced_table": "users",
            "referenced_column": "user_id",
            "referenced_schema": "public"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "review_id",
            "type": "integer",
            "example": "1,2,3",
            "description": "This is the 'review_id' column of the 'reviews' table."
          },
          {
            "name": "product_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'product_id' column of the 'reviews' table."
          },
          {
            "name": "user_id",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'user_id' column of the 'reviews' table."
          },
          {
            "name": "rating",
            "type": "integer",
            "example": "3,5,4",
            "description": "This is the 'rating' column of the 'reviews' table."
          },
          {
            "name": "review_text",
            "type": "text",
            "example": "Interesting read, but a bit sl",
            "description": "This is the 'review_text' column of the 'reviews' table."
          },
          {
            "name": "created_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'created_at' column of the 'reviews' table."
          },
          {
            "name": "updated_at",
            "type": "timestamp without time zone",
            "example": "2024-08-05 11:28:17",
            "description": "This is the 'updated_at' column of the 'reviews' table."
          }
        ],
        "schema": "public",
        "metrics": [],
        "table_name": "reviews",
        "description": "",
        "relationships": [
          {
            "column": "review_id",
            "referenced_table": "reviews",
            "referenced_column": "review_id",
            "referenced_schema": "public"
          },
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          },
          {
            "column": "user_id",
            "referenced_table": "users",
            "referenced_column": "user_id",
            "referenced_schema": "public"
          },
          {
            "column": "review_id",
            "referenced_table": "reviews",
            "referenced_column": "review_id",
            "referenced_schema": "public"
          },
          {
            "column": "product_id",
            "referenced_table": "products",
            "referenced_column": "product_id",
            "referenced_schema": "public"
          },
          {
            "column": "user_id",
            "referenced_table": "users",
            "referenced_column": "user_id",
            "referenced_schema": "public"
          }
        ]
      }
    ],
    "schema_name": "public"
  }

  ];

  const crewManager = useMemo(() => new CrewManager(schema, selectedModel), [schema, selectedModel]);

  useEffect(() => {
    const defaultModels: GroqModel[] = [
      { id: 'llama-3.1-8b-instant' },
      { id: 'llama-3.3-70b-versatile' },
      { id: 'meta-llama/llama-guard-4-12b' },
      { id: 'openai/gpt-oss-120b' },
      { id: 'openai/gpt-oss-20b' },
      { id: 'whisper-large-v3' },
      { id: 'whisper-large-v3-turbo' },
      { id: 'groq/compound' },
      { id: 'groq/compound-mini' },
      { id: 'meta-llama/llama-4-maverick-17b-128e-instruct' },
      { id: 'meta-llama/llama-4-scout-17b-16e-instruct' },
      { id: 'openai/gpt-oss-safeguard-20b' },
      { id: 'qwen/qwen3-32b' },
      { id: 'canopylabs/orpheus-arabic-saudi' },
      { id: 'canopylabs/orpheus-v1-english' },
      { id: 'meta-llama/llama-prompt-guard-2-22m' },
      { id: 'meta-llama/llama-prompt-guard-2-86m' },
      { id: 'moonshotai/kimi-k2-instruct-0905' },
    ];

    const fetchModels = async () => {
      if (!GROQ_API_KEY) {
        setModels(defaultModels);
        setModelsError('Set VITE_GROQ_API_KEY to load live models.');
        return;
      }

      setModelsLoading(true);
      setModelsError('');

      try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch models (${response.status})`);
        }

        const data = await response.json();
        const fetchedModels: GroqModel[] = Array.isArray(data?.data)
          ? data.data
              .map((model: any) => (model?.id ? { id: model.id, owned_by: model.owned_by } : null))
              .filter(Boolean)
          : [];

        const modelsToUse = fetchedModels.length ? fetchedModels : defaultModels;
        setModels(modelsToUse);
        setSelectedModel((prev) => prev || modelsToUse[0]?.id || 'llama-3.1-8b-instant');
      } catch (error) {
        console.error('Error fetching models', error);
        setModels(defaultModels);
        setModelsError('Unable to fetch live models. Using defaults.');
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (!GROQ_API_KEY) {
      setResult('GROQ API key missing. Please set VITE_GROQ_API_KEY.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await crewManager.processQuery(query, selectedModel);
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while processing your query.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
           <h1 className="text-2xl font-bold mb-6">Database Query Assistant</h1>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Select model</label>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.id}
                  </option>
                ))}
              </select>
              {modelsLoading && <span className="text-sm text-gray-500">Loading...</span>}
            </div>
            {modelsError && <p className="text-sm text-red-600 mt-1">{modelsError}</p>}
          </div>
           
           <div className="flex gap-2 mb-6">
             <input
               type="text"
               value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {result && (
            <div className="bg-gray-50 rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
              <p className="whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
