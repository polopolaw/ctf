package omctf2020ad.s4femap.configurations

import org.hibernate.dialect.Dialect
import org.hibernate.dialect.function.SQLFunctionTemplate
import org.hibernate.dialect.function.StandardSQLFunction
import org.hibernate.dialect.function.VarArgsSQLFunction
import org.hibernate.type.IntegerType
import org.hibernate.type.StringType
import java.sql.Types


class SQLiteDialect : Dialect() {
    fun supportsIdentityColumns(): Boolean {
        return true
    }

    /*
     public boolean supportsInsertSelectIdentity() {
     return true; // As specify in NHibernate dialect
     }
     */
    fun hasDataTypeInIdentityColumn(): Boolean {
        return false // As specify in NHibernate dialect
    }// return "integer primary key autoincrement";

    val identityColumnString: String
        get() =// return "integer primary key autoincrement";
            "integer"

    val identitySelectString: String
        get() = "select last_insert_rowid()"

    override fun supportsLimit(): Boolean {
        return true
    }

    public override fun getLimitString(query: String, hasOffset: Boolean): String {
        return StringBuffer(query.length + 20).append(query).append(
                if (hasOffset) " limit ? offset ?" else " limit ?").toString()
    }

    fun supportsTemporaryTables(): Boolean {
        return true
    }

    val createTemporaryTableString: String
        get() = "create temporary table if not exists"

    fun dropTemporaryTableAfterUse(): Boolean {
        return false
    }

    override fun supportsCurrentTimestampSelection(): Boolean {
        return true
    }

    override fun isCurrentTimestampSelectStringCallable(): Boolean {
        return false
    }

    override fun getCurrentTimestampSelectString(): String {
        return "select current_timestamp"
    }

    override fun supportsUnionAll() = true

    override fun getAddColumnString() = "add column"

    override fun getForUpdateString() = ""

    override fun supportsOuterJoinForUpdate() = false

    override fun supportsIfExistsBeforeTableName() = true

    override fun supportsCascadeDelete() = false

    override fun getIdentityColumnSupport() = SQLiteIdentityColumnSupport()

    override fun hasAlterTable() = false

    override fun dropConstraints() = false

    override fun getDropForeignKeyString() = ""

    override fun getAddForeignKeyConstraintString(cn: String?, fk: Array<String?>?, t: String?, pk: Array<String?>?, rpk: Boolean) = ""

    override fun getAddPrimaryKeyConstraintString(constraintName: String?) = ""

    init {
        registerColumnType(Types.BIT, "integer")
        registerColumnType(Types.TINYINT, "tinyint")
        registerColumnType(Types.SMALLINT, "smallint")
        registerColumnType(Types.INTEGER, "integer")
        registerColumnType(Types.BIGINT, "bigint")
        registerColumnType(Types.FLOAT, "float")
        registerColumnType(Types.REAL, "real")
        registerColumnType(Types.DOUBLE, "double")
        registerColumnType(Types.NUMERIC, "numeric")
        registerColumnType(Types.DECIMAL, "decimal")
        registerColumnType(Types.CHAR, "char")
        registerColumnType(Types.VARCHAR, "varchar")
        registerColumnType(Types.LONGVARCHAR, "longvarchar")
        registerColumnType(Types.DATE, "date")
        registerColumnType(Types.TIME, "time")
        registerColumnType(Types.TIMESTAMP, "timestamp")
        registerColumnType(Types.BINARY, "blob")
        registerColumnType(Types.VARBINARY, "blob")
        registerColumnType(Types.LONGVARBINARY, "blob")
        registerColumnType(Types.NULL, "null")
        registerColumnType(Types.BLOB, "blob")
        registerColumnType(Types.CLOB, "clob")
        registerColumnType(Types.BOOLEAN, "integer")
        registerFunction("concat", VarArgsSQLFunction(StringType.INSTANCE, "", "||", ""))
        registerFunction("mod", SQLFunctionTemplate(IntegerType.INSTANCE, "?1 % ?2"))
        registerFunction("substr", StandardSQLFunction("substr", StringType.INSTANCE))
        registerFunction("substring", StandardSQLFunction("substr", StringType.INSTANCE))
    }
}